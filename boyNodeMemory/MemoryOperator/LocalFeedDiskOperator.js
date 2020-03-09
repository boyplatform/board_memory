'use strict'
var conf=require("../src/config");
var InodeCahce=require("../coreLibs/iNodeCache");
var memoryCommon=require('../src/boyMemoryCommon.js');
var MemoryNodeInfoRecord=require("../Dao/MemoryNodeInfoRecord");
var LocalFeedShadow=require("../pojo/localFeedShadow");
var DiskDataTalker=require("../SectionClusterTalker/DiskDataTalker");

function LocalFeedDiskOperator(){
  
    this.memoryNodeCache=new InodeCahce("localFeedCache");
    this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
    this.diskDataTalker=new DiskDataTalker();
};

LocalFeedDiskOperator.prototype.constructor=LocalFeedDiskOperator;

//connection to cluster
LocalFeedDiskOperator.prototype.setConn=function(){

    this.memoryNodeCache.setConn({});
   
};
 
//query-out operation
LocalFeedDiskOperator.prototype.dataRead=function(reqStorageClusterDbType,targetDbName,keyObjName,keyObjType,querySql,ttl,cacheGenMethod,cb){
    
    //make querysql into sha256 as a key
    var querySqlSha=memoryCommon.getSha256(reqStorageClusterDbType.toString()+targetDbName+keyObjName+keyObjType+querySql,conf.platformArch.shaHashLengh);
    //get value per the sha256 from current nodeDb
    this.memoryNodeInfoRecord.localFeedShadowSelect("1","where keyObjName=? and keyObjType=? and targetDbName=? and querySqlSha=?",[keyObjName,keyObjType,targetDbName,querySqlSha],"",function(rows){
            
            if(rows!==undefined&&rows.length>0){
            //if existed return it via cb
                for(let row of rows){
                console.log("LocalFeedDisk memory was readed once.");
                cb(row.value);     
                }    
            }
            else
            {
                //try to get value from MemCached memory
                        //if existed return it via cb
                        var key=querySqlSha;
                        this.memoryNodeCache.get(key,function(err,value){
                                if(err){
                                    console.log(err);
                                    cb([{"MemError":"Level4"}]);
                                }
                                else if(value!=undefined&&value!=null&&value!=""){
                                    console.log("LocalFeedDisk memory was readed once.");
                                    cb(value); 
                                }
                                else
                                {
                                        //try to get value from disk-data
                                        this.diskDataTalker.seekDataFromDiskData(reqStorageClusterDbType,querySql,function(valueFromDiskData){
                                            //set value into MemCached memory per ttl ,save the value into current nodeDb, and return value via cb
                                            if(valueFromDiskData!=undefined&&valueFromDiskData!=null&&valueFromDiskData!="[]"){
                                                        
                                                this.memoryNodeCache.set(key,valueFromDiskData,{ttl:ttl},function(err,ok){
                                                    if(err){
                                                        console.log("LocalFeedDiskOperator error:",err);
                                                        cb([{"MemError":"Level4"}]); 
                                                    }

                                                    if(ok){
                                                        memoryCommon.getFileKbSize(this.memoryNodeCache.localFeedCache.localFeedPath+key.toString().trim()+".txt",function(feedSize){
                                                            
                                                            var localFeedShadow=new LocalFeedShadow(memoryCommon.getUUID(),this.memoryNodeCache.localFeedCache.localFeedPath,key.toString().trim()+".txt",feedSize,memoryCommon.GetFormatDateFromTimeSpan(Date.now()),null,keyObjName,"txt",keyObjType,memoryCommon.getSha256(valueFromDiskData,conf.platformArch.shaHashLengh),
                                                            cacheGenMethod,querySqlSha,null,querySql,null,ttl,targetDbName,valueFromDiskData,reqStorageClusterDbType);
        
                                                            //var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                                                            this.memoryNodeInfoRecord.localFeedShadowInsert(localFeedShadow);
                                                        
                                                            console.log("LocalFeedDisk memory was reset once under key:",key);
                                                        }.bind(this))
                                                    
                                                    }
                                                }.bind(this));
                                            }
                                            console.log("LocalFeedDisk memory was readed once.");
                                            cb(valueFromDiskData);
                                        }.bind(this));

                                }
                        }.bind(this));
            }
        }.bind(this));
        
};



module.exports=LocalFeedDiskOperator;