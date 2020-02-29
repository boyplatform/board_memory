'use strict'
var conf=require("../src/config");
var InodeCahce=require("../coreLibs/iNodeCache.js");
var memoryCommon=require('../src/boyMemoryCommon.js');
var MemoryNodeInfoRecord=require("../Dao/MemoryNodeInfoRecord.js");
var LocalFeedShadow=require("../pojo/localFeedShadow.js");
var DiskDataTalker=require("../SectionClusterTalker/DiskDataTalker");

function LocalFeedDiskDORSchedule(){
     
    if(this.memoryNodeInfoRecord===undefined){
       this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
    }
    if(this.diskDataTalker===undefined){
       this.diskDataTalker=new DiskDataTalker();
     }
};

LocalFeedDiskDORSchedule.prototype.constructor=LocalFeedDiskDORSchedule;

//data output timely refresher method
LocalFeedDiskDORSchedule.prototype.DOR=function(){
    
      //seek localFeedShadow query records from current nodeDB.
      if(this.memoryNodeInfoRecord===undefined){
         this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
       }
       this.memoryNodeInfoRecord.localFeedShadowSelect("","where (querySqlSha<>'' and querySqlSha is not null) and (querySql<>'' and querySql is not null)",[""],"",function(rows){
            
            if(rows!=undefined)
            {
                for(let row of rows){
                    //seek data per the shadow querysql value from disk-data.
                    this.diskDataTalker.seekDataFromDiskData(row.querySql,function(valueFromDiskData){
                            //take the return back value from disk-data,make it to be sha256,verify whether it's match to existed sha256 under current nodeDb.
                            if(valueFromDiskData!=undefined&&valueFromDiskData!=null&&valueFromDiskData!="[]"){
                                                        
                                    var valueSha=memoryCommon.getSha256(valueFromDiskData,conf.platformArch.shaHashLengh);
                                    //console.log("row.valueSha:",row.valueSha);
                                    //console.log("valueSha:",valueSha);
                                    if(row.valueSha!==valueSha){
                                        //if it's not matched, update new value-sha256 to current NodeDB per querysqlSha,keyObjName,keyObjType, meanwhile update the value to the local disk feed cache file.
                                        var localFeedShadow=new LocalFeedShadow(row.localFeedGuid,row.feedPath,row.feedName,row.feedSize,row.createTime,
                                            row.updateTime,row.keyObjName,row.feedExtName,row.keyObjType,row.valueSha,
                                            row.cacheGenMethod,row.querySqlSha,row.writeSqlSha,row.querySql,row.writeSql,row.ttl,row.targetDbName);

                                            localFeedShadow.valueSha=valueSha;
                                            
                                            var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                                            memoryNodeInfoRecord.localFeedShadowUpdate(localFeedShadow);
                                            
                                            var memoryNodeCache=new InodeCahce("localFeedCache");
                                            memoryNodeCache.setConn(undefined);
                                            memoryNodeCache.set(row.querySqlSha,valueFromDiskData,{ttl:row.ttl},function(err,ok){
                                                if(err){
                                                    console.log("LocalFeedDiskDORSchedule error:",err);
                                                    
                                                }

                                                if(ok){
                                                    console.log("LocalFeedDisk memory was reset once under key:",row.querySqlSha);
                                                }
                                            });      
                                    }
                            }
                    }.bind(this));
                    
                }
            }
       }.bind(this));
     
}


module.exports=LocalFeedDiskDORSchedule;
