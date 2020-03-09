'use strict'
var conf=require("../src/config");
var InodeCahce=require("../coreLibs/iNodeCache");
var memoryCommon=require('../src/boyMemoryCommon.js');
var MemoryNodeInfoRecord=require("../Dao/MemoryNodeInfoRecord");
var MemCacheShadow=require("../pojo/memCacheShadow");
var DiskDataTalker=require("../SectionClusterTalker/DiskDataTalker");

function MemCacheOperator(){
   
    this.memoryNodeCache=new InodeCahce("memCached");
    this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
    this.diskDataTalker=new DiskDataTalker();
};

MemCacheOperator.prototype.constructor=MemCacheOperator;

//connection to cluster
MemCacheOperator.prototype.setConn=function(){

  
    if(conf.memCachedPoolConfig!=undefined)
    {
        this.memoryNodeCache.setConn(conf.memCachedPoolConfig);
    }
};




//query-out operation
MemCacheOperator.prototype.dataRead=function(reqStorageClusterDbType,targetDbName,keyObjName,keyObjType,querySql,ttl,cacheGenMethod,cb){

    
    //make querysql into sha256 as a key
    var querySqlSha=memoryCommon.getSha256(reqStorageClusterDbType.toString()+targetDbName+keyObjName+keyObjType+querySql,conf.platformArch.shaHashLengh);
    //get value per the sha256 from current nodeDb
    this.memoryNodeInfoRecord.memCacheShadowSelect("1","where keyObjName=? and keyObjType=? and targetDbName=? and querySqlSha=?",[keyObjName,keyObjType,targetDbName,querySqlSha],"",function(rows){
            if(rows!==undefined&&rows.length>0){
            //if existed return it via cb
                for(let row of rows){
                   console.log("memCached memory was readed once.");
                   cb(row.value);     
                }    
            }else{
                //try to get value from MemCached memory
                    //if existed return it via cb
                var key=querySqlSha;
                this.memoryNodeCache.get(key,function(err,value){
                    if(err){
                        console.log(err);
                        cb([{"MemError":"Level2"}]); 
                    }
                    else if(value!=undefined&&value!=null&&value!=""){
                        console.log("memCached memory was readed once.");
                        cb(value); 
                    }else{
                            //try to get value from disk-data
                            this.diskDataTalker.seekDataFromDiskData(reqStorageClusterDbType,querySql,function(valueFromDiskData){
                                //set value into MemCached memory per ttl ,save the value into current nodeDb, and return value via cb
                                if(valueFromDiskData!=undefined&&valueFromDiskData!=null&&valueFromDiskData!="[]"){
                                            
                                    this.memoryNodeCache.set(key,valueFromDiskData,{expire:ttl},function(err,data){
                                        if(err){
                                            console.log("MemCacheOperator error:",err);
                                            cb([{"MemError":"Level2"}]);  
                                        }
                                        if(data!=null){
                                            var memCacheShadow=new MemCacheShadow(memoryCommon.getUUID(),keyObjName,keyObjType,memoryCommon.getSha256(valueFromDiskData,conf.platformArch.shaHashLengh),
                                            memoryCommon.GetFormatDateFromTimeSpan(Date.now()),memoryCommon.GetFormatDateFromTimeSpan(Date.now()),valueFromDiskData,cacheGenMethod,querySqlSha,null,
                                            querySql,null,ttl,targetDbName,reqStorageClusterDbType);

                                            //var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                                            this.memoryNodeInfoRecord.memCacheShadowInsert(memCacheShadow);
                                            console.log("MemCacheOperator set data to memcached:",data);
                                            console.log("memCached memory was reset once under key:",key);
                                        }
                                    }.bind(this));
                                }
                                console.log("memCached memory was readed once.");
                                cb(valueFromDiskData);
                            }.bind(this));

                    }
                }.bind(this));

            }
        }.bind(this));
    
    
    
        
    
};

module.exports=MemCacheOperator;