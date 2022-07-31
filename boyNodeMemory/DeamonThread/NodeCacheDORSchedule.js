'use strict'
var conf=require("../src/config");
var InodeCahce=require("../coreLibs/iNodeCache");
var memoryCommon=require('../src/boyMemoryCommon.js');
var MemoryNodeInfoRecord=require("../Dao/MemoryNodeInfoRecord");
var NodeCacheShadow=require("../pojo/nodeCacheShadow");
var DiskDataTalker=require("../SectionClusterTalker/DiskDataTalker");


function NodeCacheDORSchedule(){
   
    if(this.memoryNodeInfoRecord===undefined){
     this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
    }
    if(this.diskDataTalker===undefined){
        this.diskDataTalker=new DiskDataTalker();
     }
};

NodeCacheDORSchedule.prototype.constructor=NodeCacheDORSchedule;

//data output timely refresher method
NodeCacheDORSchedule.prototype.DOR=function(){

    //seek NodeCacheShadow query records from current nodeDB.
    if(this.memoryNodeInfoRecord===undefined){
        this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
       }
     this.memoryNodeInfoRecord.nodeCacheShadowSelect("","where (querySqlSha<>'' and querySqlSha is not null) and (querySql<>'' and querySql is not null)",[""],"",function(rows){
        
        if(rows!=undefined)
        {
            for(let row of rows){
                //seek data per the shadow querysql value from disk-data.
                this.diskDataTalker.seekDataFromDiskData(row.reqStorageClusterDbType,row.querySql,function(valueFromDiskData){
                        //take the return back value from disk-data,make it to be sha256,verify whether it's match to existed sha256 under current nodeDb.
                        if(valueFromDiskData!=undefined&&valueFromDiskData!=null&&valueFromDiskData!="[]"){
                            //if it's not matched, update new value&value-sha256 to current NodeDB per querysqlSha,keyObjName,keyObjType,meanwhile update the value to NodeCache per (querysqlSha as key).
                            var valueSha=memoryCommon.getSha256(valueFromDiskData,conf.platformArch.shaHashLengh);
                            if(row.valueSha!==valueSha){
                                var nodeCacheShadow=new NodeCacheShadow(row.nodeCacheGuid,row.keyObjName,row.keyObjType,row.valueSha,row.createTime,
                                    row.updateTime,row.value,row.cacheGenMethod,row.querySqlSha,row.writeSqlSha,
                                    row.querySql,row.writeSql,row.ttl,row.targetDbName,row.reqStorageClusterDbType);

                                    nodeCacheShadow.valueSha=valueSha;
                                    nodeCacheShadow.value=valueFromDiskData;
                                    nodeCacheShadow.updateTime=memoryCommon.GetFormatDateFromTimeSpan(Date.now());

                                    //var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                                    this.memoryNodeInfoRecord.nodeCacheShadowUpdate(nodeCacheShadow);

                                    var memoryNodeCache=new InodeCahce("singleNodeCache");
                                    memoryNodeCache.setConn(undefined);
                                    memoryNodeCache.set(row.querySqlSha,valueFromDiskData,{ttl:row.ttl},function(err,ok){
                                        if(err){
                                            console.log("NodeCacheDORSchedule error:",err);
                                            
                                        }

                                        if(ok==="OK"){
                                            console.log("singleNodeCache memory was reset once under key:",row.querySqlSha);
                                        }
                                    });   
                            }
                        }
                }.bind(this));              
            }
        }
     }.bind(this));
      
};


module.exports=NodeCacheDORSchedule;