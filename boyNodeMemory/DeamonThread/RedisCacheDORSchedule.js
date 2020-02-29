'use strict'
var conf=require("../src/config");
var InodeCahce=require("../coreLibs/iNodeCache");
var memoryCommon=require('../src/boyMemoryCommon.js');
var MemoryNodeInfoRecord=require("../Dao/MemoryNodeInfoRecord");
var RedisCacheShadow=require("../pojo/redisCacheShadow");
var DiskDataTalker=require("../SectionClusterTalker/DiskDataTalker");

function RedisCacheDORSchedule(){
   
    if(this.memoryNodeInfoRecord===undefined){
       this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
    }
    if(this.diskDataTalker===undefined){
       this.diskDataTalker=new DiskDataTalker();
    }
};

RedisCacheDORSchedule.prototype.constructor=RedisCacheDORSchedule;

//data output timely refresher method
RedisCacheDORSchedule.prototype.DOR=function(){
     //seek RedisCacheShadow query records from current nodeDB.
     if(this.memoryNodeInfoRecord===undefined){
        this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
       }
     this.memoryNodeInfoRecord.redisCacheShadowSelect("","where (querySqlSha<>'' and querySqlSha is not null) and (querySql<>'' and querySql is not null)",[""],"",function(rows){
        
        if(rows!=undefined)
        {
                for(let row of rows)
                {
                    //seek data per the shadow querysql value from disk-data.
                    this.diskDataTalker.seekDataFromDiskData(row.querySql,function(valueFromDiskData){
                            //take the return back value from disk-data,make it to be sha256,verify whether it's match to existed sha256 under current nodeDb.
                            if(valueFromDiskData!=undefined&&valueFromDiskData!=null&&valueFromDiskData!="[]"){
                                //if it's not matched, update new value&value-sha256 to current NodeDB per querysqlSha,keyObjName,keyObjType,meanwhile update the value to Redis cluster per (querysqlSha as key). 
                                var valueSha=memoryCommon.getSha256(valueFromDiskData,conf.platformArch.shaHashLengh);
                                if(row.valueSha!==valueSha)
                                {
                                    
                                    var redisCacheShadow=new RedisCacheShadow(row.localFeedGuid,row.feedPath,row.feedName,row.feedSize,row.createTime,
                                        row.updateTime,row.keyObjName,row.feedExtName,row.keyObjType,row.valueSha,
                                        row.cacheGenMethod,row.querySqlSha,row.writeSqlSha,row.querySql,row.writeSql,row.ttl,row.targetDbName);

                                        redisCacheShadow.valueSha=valueSha;
                                        redisCacheShadow.value=valueFromDiskData;

                                        //var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                                        this.memoryNodeInfoRecord.redisCacheShadowUpdate(redisCacheShadow);

                                            var memoryNodeCache=undefined;
                                            if(conf.platformArch.redisMode==="cluster"){
                                                memoryNodeCache=new InodeCahce("redisCluster");
                                                memoryNodeCache.setConn(conf.redisClusterPoolConfig);
                                            }else{
                                                memoryNodeCache=new InodeCahce("redis");
                                                memoryNodeCache.setConn(conf.redisPoolConfig);
                                            }
                                            
                                            memoryNodeCache.set(row.querySqlSha,valueFromDiskData,{ttl:row.ttl},function(err,ok){
                                                if(err){
                                                    console.log("RedisCacheDORSchedule error:",err);
                                                    
                                                }
                                
                                                if(ok){
                                                    console.log("Redis memory was reset once under key:",row.querySqlSha);
                                                }
                                            });   

                                }
                            }
                    }.bind(this));
                }
        }
         
     }.bind(this));
      
};


module.exports=RedisCacheDORSchedule;
