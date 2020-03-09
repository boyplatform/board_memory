'use strict'
var conf=require("../src/config");
var InodeCahce=require("../coreLibs/iNodeCache");
var memoryCommon=require('../src/boyMemoryCommon.js');
var MemoryNodeInfoRecord=require("../Dao/MemoryNodeInfoRecord");
var MemCacheShadow=require("../pojo/memCacheShadow");
var DiskDataTalker=require("../SectionClusterTalker/DiskDataTalker");

function MemCacheDORSchedule(){
 
    if(this.memoryNodeInfoRecord===undefined){
     this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
    }
    if(this.diskDataTalker===undefined){
        this.diskDataTalker=new DiskDataTalker();
     }
};

MemCacheDORSchedule.prototype.constructor=MemCacheDORSchedule;

//data output timely refresher method
MemCacheDORSchedule.prototype.DOR=function(){
    //seek MemCacheShadow query records from current nodeDB.
    if(this.memoryNodeInfoRecord===undefined){
        this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
       }
     this.memoryNodeInfoRecord.memCacheShadowSelect("","where (querySqlSha<>'' and querySqlSha is not null) and (querySql<>'' and querySql is not null)",[""],"",function(rows){
        
        if(rows!=undefined)
        {
            for(let row of rows){
                //seek data per the shadow querysql value from disk-data.
                this.diskDataTalker.seekDataFromDiskData(row.reqStorageClusterDbType,row.querySql,function(valueFromDiskData){
                        //take the return back value from disk-data,make it to be sha256,verify whether it's match to existed sha256 under current nodeDb.
                        if(valueFromDiskData!=undefined&&valueFromDiskData!=null&&valueFromDiskData!="[]")
                        {
                            //if it's not matched, update new value&value-sha256 to current NodeDB per querysqlSha,keyObjName,keyObjType,meanwhile update the value to memCached cluster per (querysqlSha as key). 
                            var valueSha=memoryCommon.getSha256(valueFromDiskData,conf.platformArch.shaHashLengh);
                            if(row.valueSha!==valueSha){
                                var memCacheShadow=new MemCacheShadow(row.localFeedGuid,row.feedPath,row.feedName,row.feedSize,row.createTime,
                                    row.updateTime,row.keyObjName,row.feedExtName,row.keyObjType,row.valueSha,
                                    row.cacheGenMethod,row.querySqlSha,row.writeSqlSha,row.querySql,row.writeSql,row.ttl,row.targetDbName);

                                    memCacheShadow.valueSha=valueSha;
                                    memCacheShadow.value=valueFromDiskData;

                                    //var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                                    this.memoryNodeInfoRecord.memCacheShadowUpdate(memCacheShadow);

                                    var memoryNodeCache=new InodeCahce("memCached");
                                    memoryNodeCache.setConn(conf.memCachedPoolConfig)
                                    memoryNodeCache.set(row.querySqlSha,valueFromDiskData,{expire:row.ttl},function(err,ok){
                                        if(err){
                                            console.log("MemCacheDORSchedule error:",err);
                                            
                                        }

                                        if(ok!=null){
                                            console.log("MemCached memory was reset once under key:",row.querySqlSha);
                                        }
                                    });   
                            }
                        }
                }.bind(this));
                
            }
        }
         
     }.bind(this));
      
};



module.exports=MemCacheDORSchedule;