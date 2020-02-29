'use strict'
var conf=require("../src/config");
var InodeCahce=require("../coreLibs/iNodeCache");
var memoryCommon=require('../src/boyMemoryCommon.js');
var MemoryNodeInfoRecord=require("../Dao/MemoryNodeInfoRecord");
var NodeCacheShadow=require("../pojo/nodeCacheShadow");
var DiskDataTalker=require("../SectionClusterTalker/DiskDataTalker");

function NodeCacheOperator(){
   
    this.memoryNodeCache=new InodeCahce("singleNodeCache");
    this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
    this.diskDataTalker=new DiskDataTalker();
};

NodeCacheOperator.prototype.constructor=NodeCacheOperator;

//connection to cluster
NodeCacheOperator.prototype.setConn=function(){

    this.memoryNodeCache.setConn({});
   
};


//query-out operation
NodeCacheOperator.prototype.dataRead=function(targetDbName,keyObjName,keyObjType,querySql,ttl,cacheGenMethod,cb){
    
    //make querysql into sha256 as a key
    var querySqlSha=memoryCommon.getSha256(targetDbName+keyObjName+keyObjType+querySql,conf.platformArch.shaHashLengh);
    //get value per the sha256 from current nodeDb
    this.memoryNodeInfoRecord.nodeCacheShadowSelect("1","where keyObjName=? and keyObjType=? and targetDbName=? and querySqlSha=?",[keyObjName,keyObjType,targetDbName,querySqlSha],"",function(rows){
            if(rows!==undefined&&rows.length>0){
            //if existed return it via cb
                for(let row of rows){
                console.log("singleNode memory was readed once.");
                cb(row.value);     
                }    
            }else{

                //try to get value from MemCached memory
                    //if existed return it via cb
                var key=querySqlSha;
                this.memoryNodeCache.get(key,function(err,value){
                    if(err){
                        console.log(err);
                        cb([{"MemError":"Level1"}]); 
                    }
                    else if(value!=undefined&&value!=null&&value!=""){
                        console.log("singleNode memory was readed once.");
                        cb(value); 
                    }else{
                            //try to get value from disk-data
                            this.diskDataTalker.seekDataFromDiskData(querySql,function(valueFromDiskData){
                                //set value into MemCached memory per ttl ,save the value into current nodeDb, and return value via cb
                                if(valueFromDiskData!=undefined&&valueFromDiskData!=null&&valueFromDiskData!="[]"){
                                            
                                    this.memoryNodeCache.set(key,valueFromDiskData,{ttl:ttl},function(err,ok){
                                        if(err){
                                            console.log("NodeCacheOperator error:",err);
                                            cb([{"MemError":"Level1"}]); 
                                        }
                                        if(ok==="OK"){
                                            var nodeCacheShadow=new NodeCacheShadow(memoryCommon.getUUID(),keyObjName,keyObjType,memoryCommon.getSha256(valueFromDiskData,conf.platformArch.shaHashLengh),
                                            memoryCommon.GetFormatDateFromTimeSpan(Date.now()),memoryCommon.GetFormatDateFromTimeSpan(Date.now()),valueFromDiskData,cacheGenMethod,querySqlSha,null,
                                            querySql,null,ttl,targetDbName);
                                            //var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                                            this.memoryNodeInfoRecord.nodeCacheShadowInsert(nodeCacheShadow);
                                        
                                            console.log("singleNode memory was reset once under key:",key);
                                        }
                                    }.bind(this));
                                }
                                console.log("singleNode memory was readed once.");
                                cb(valueFromDiskData);  
                            }.bind(this));

                    }
                }.bind(this));

            }
        }.bind(this));
    

    
        
};





module.exports=NodeCacheOperator;



