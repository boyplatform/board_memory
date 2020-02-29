'use strict'
var conf=require("../src/config");
var InodeCahce=require("../coreLibs/iNodeCache");
var memoryCommon=require('../src/boyMemoryCommon.js');
var MemoryNodeInfoRecord=require("../Dao/MemoryNodeInfoRecord");

var LocalFeedShadow=require("../pojo/localFeedShadow");
var MemCacheShadow=require("../pojo/memCacheShadow");
var NodeCacheShadow=require("../pojo/nodeCacheShadow");
var RedisCacheShadow=require("../pojo/redisCacheShadow");

require('date-utils');

function CacheShadowGACSchedule(){

    if(this.memoryNodeInfoRecord===undefined){
        this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
       }
}


CacheShadowGACSchedule.prototype.constructor=CacheShadowGACSchedule;

CacheShadowGACSchedule.prototype.ShadowGACExecute=function(){

    //localFeedShadow GAC
       //loop localFeedShadow, verify whether now>row.createTime+ttl, if yes, then delete the localFeedShadow
       if(this.memoryNodeInfoRecord===undefined){
        this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
       }
       this.memoryNodeInfoRecord.localFeedShadowSelect("","where (querySqlSha<>'' and querySqlSha is not null) and (querySql<>'' and querySql is not null)",[""],"",function(rows){

          if(rows!==undefined){
                for(let row of rows)
                {
                    let now=new Date();
                    let gacTimeBaseOnCreateTime=row.createTime.clone();                       
            
                        gacTimeBaseOnCreateTime.addSeconds(row.ttl);
                        if(now>=gacTimeBaseOnCreateTime){
                            var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                            memoryNodeInfoRecord.localFeedShadowDelete(row.localFeedId);
                        }
                }
            }
       });

    //memCacheShadow GAC
       //loop memCacheShadow, verify whether now>row.createTime+ttl, if yes, then delete the memCacheShadow 
       this.memoryNodeInfoRecord.memCacheShadowSelect("","where (querySqlSha<>'' and querySqlSha is not null) and (querySql<>'' and querySql is not null)",[""],"",function(rows){
            if(rows!==undefined){
                for(let row of rows)
                {
                let now=new Date();
                let gacTimeBaseOnCreateTime=row.createTime.clone();                       
        
                    gacTimeBaseOnCreateTime.addSeconds(row.ttl);
                    if(now>=gacTimeBaseOnCreateTime){
                        var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                        memoryNodeInfoRecord.memCacheShadowDelete(row.memCacheId);
                    }
                }
            }
      }); 
    //nodeCacheShadow GAC
        //loop nodeCacheShadow, verify whether now>row.createTime+ttl, if yes, then delete the nodeCacheShadow
        this.memoryNodeInfoRecord.nodeCacheShadowSelect("","where (querySqlSha<>'' and querySqlSha is not null) and (querySql<>'' and querySql is not null)",[""],"",function(rows){

            if(rows!==undefined){
                for(let row of rows)
                {
                    let now=new Date();
                    let gacTimeBaseOnCreateTime=row.createTime.clone();                       
            
                        gacTimeBaseOnCreateTime.addSeconds(row.ttl);
                        if(now>=gacTimeBaseOnCreateTime){
                            var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                            memoryNodeInfoRecord.nodeCacheShadowDelete(row.nodeCacheId);
                        }
                }
            }
        });  
    //redisCacheShadow GAC
        //loop redisCacheShadow, verify whether now>row.createTime+ttl, if yes, then delete the redisCacheShadow
        this.memoryNodeInfoRecord.redisCacheShadowSelect("","where (querySqlSha<>'' and querySqlSha is not null) and (querySql<>'' and querySql is not null)",[""],"",function(rows){

            if(rows!==undefined){
                for(let row of rows)
                {
                    let now=new Date();
                    let gacTimeBaseOnCreateTime=row.createTime.clone();                       
            
                        gacTimeBaseOnCreateTime.addSeconds(row.ttl);
                        if(now>=gacTimeBaseOnCreateTime){
                            var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                            memoryNodeInfoRecord.redisCacheShadowDelete(row.redisCacheId);
                        }
                }
            }
        }); 


}



module.exports=CacheShadowGACSchedule;