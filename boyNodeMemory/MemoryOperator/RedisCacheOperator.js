'use strict'
var conf=require("../src/config");
var InodeCahce=require("../coreLibs/iNodeCache");
var memoryCommon=require('../src/boyMemoryCommon.js');
var MemoryNodeInfoRecord=require("../Dao/MemoryNodeInfoRecord");
var RedisCacheShadow=require("../pojo/redisCacheShadow");
var DiskDataTalker=require("../SectionClusterTalker/DiskDataTalker");

function RedisCacheOperator(){
    if(conf.platformArch.redisMode==="cluster"){
      this.memoryNodeCache=new InodeCahce("redisCluster");
    }else
    {
      this.memoryNodeCache=new InodeCahce("redis");
    }
    this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
    this.diskDataTalker=new DiskDataTalker();
};

RedisCacheOperator.prototype.constructor=RedisCacheOperator;

//connection to cluster
RedisCacheOperator.prototype.setConn=function(){

   
        if(conf.redisPoolConfig!=undefined)
        {
            if(conf.platformArch.redisMode==="cluster"){
               this.memoryNodeCache.setConn(conf.redisClusterPoolConfig);
            }else{
               this.memoryNodeCache.setConn(conf.redisPoolConfig);
            }
        }
  
}

//write-in operation
RedisCacheOperator.prototype.dataWrite=function(reqStorageClusterDbType,redisCacheOperator,targetDbName,writeSql,cb){
    
    //verify whether there some key word regarding write under value,if no,ban the operation and return alert via cb
    if(writeSql.indexOf("insert")<0 
    && writeSql.indexOf("INSERT")<0
    && writeSql.indexOf("Insert")<0  
    && writeSql.indexOf("update")<0 
    && writeSql.indexOf("UPDATE")<0
    && writeSql.indexOf("Update")<0
    && writeSql.indexOf("delete")<0
    && writeSql.indexOf("DELETE")<0
    && writeSql.indexOf("Delete")<0
    && writeSql.indexOf("add")<0
    && writeSql.indexOf("Add")<0
    && writeSql.indexOf("ADD")<0
    && writeSql.indexOf("modify")<0
    && writeSql.indexOf("MODIFY")<0
    && writeSql.indexOf("Modify")<0
    && writeSql.indexOf("remove")<0
    && writeSql.indexOf("REMOVE")<0
    && writeSql.indexOf("Remove")<0)
    {
        console.log("Please input write-in sql statement.");
        cb(false);
        return;
    }
    //make operation message to sha256
    var writeSqlSha=memoryCommon.getSha256(reqStorageClusterDbType.toString()+targetDbName+writeSql,conf.platformArch.shaHashLengh);

    //verify whether the operation sha was existed under current NodeDb shadow,if not existed insert value into sha column.
    this.memoryNodeInfoRecord.redisCacheShadowSelect("1","where targetDbName=? and writeSqlSha=?",[targetDbName,writeSqlSha],"order by createTime desc",function(rows){
        if(rows===undefined||rows.length<=0){

           var redisCacheShadow=new RedisCacheShadow(memoryCommon.getUUID(),null,null,null,
           memoryCommon.GetFormatDateFromTimeSpan(Date.now()),memoryCommon.GetFormatDateFromTimeSpan(Date.now()),null,null,null,writeSqlSha,
           null,writeSql,null,targetDbName,reqStorageClusterDbType);
           
           this.memoryNodeInfoRecord.redisCacheShadowInsert(redisCacheShadow);
            
        }
    }.bind(redisCacheOperator));
    
    //publish the write-in operation to redis.
    this.memoryNodeCache.publish(targetDbName+reqStorageClusterDbType.toString(),writeSql,cb);

};

//query-out operation
RedisCacheOperator.prototype.dataRead=function(reqStorageClusterDbType,targetDbName,keyObjName,keyObjType,querySql,ttl,cacheGenMethod,cb){

    
    //make querysql into sha256 as a key
    var querySqlSha=memoryCommon.getSha256(reqStorageClusterDbType.toString()+targetDbName+keyObjName+keyObjType+querySql,conf.platformArch.shaHashLengh);
    //get value per the sha256 from current nodeDb
    this.memoryNodeInfoRecord.redisCacheShadowSelect("1","where keyObjName=? and keyObjType=? and targetDbName=? and querySqlSha=?",[keyObjName,keyObjType,targetDbName,querySqlSha],"",function(rows){
            if(rows!==undefined&&rows.length>0){
            //if existed return it via cb
                for(let row of rows){
                   console.log("Redis memory was readed once.");
                   cb(row.value);     
                }    
            }else{
                //try to get value from redis memory
                        //if existed return it via cb
                        var key=querySqlSha;
                        this.memoryNodeCache.get(key,function(err,value){
                            if(err){
                                console.log(err);
                                cb([{"MemError":"Level3"}]); 
                            }
                            else if(value!=undefined&&value!=null&&value!=""){
                                console.log("Redis memory was readed once.");
                                cb(value); 
                            }else{
                                    //try to get value from disk-data
                                    this.diskDataTalker.seekDataFromDiskData(reqStorageClusterDbType,querySql,function(valueFromDiskData){
                                        //set value into redis memory per ttl ,save the value into current nodeDb, and return value via cb
                                        if(valueFromDiskData!=undefined&&valueFromDiskData!=null&&valueFromDiskData!="[]"){
                                                    
                                            this.memoryNodeCache.set(key,valueFromDiskData,{ttl:ttl},function(err,ok){
                                                if(err){
                                                    console.log("RedisCacheOperator error:",err);
                                                    cb([{"MemError":"Level3"}]); 
                                                }
                                                if(ok){
                                                    var redisCacheShadow=new RedisCacheShadow(memoryCommon.getUUID(),keyObjName,keyObjType,memoryCommon.getSha256(valueFromDiskData,conf.platformArch.shaHashLengh),
                                                    memoryCommon.GetFormatDateFromTimeSpan(Date.now()),memoryCommon.GetFormatDateFromTimeSpan(Date.now()),valueFromDiskData,cacheGenMethod,querySqlSha,null,
                                                    querySql,null,ttl,targetDbName,reqStorageClusterDbType);

                                                    //var memoryNodeInfoRecord=new MemoryNodeInfoRecord();
                                                    this.memoryNodeInfoRecord.redisCacheShadowInsert(redisCacheShadow);
                                                    console.log("Redis memory was reset once under key:",key);
                                                }
                                            }.bind(this));
                                        }
                                        console.log("Redis memory was readed once.");
                                        cb(valueFromDiskData);
                                    }.bind(this));

                            }
                        }.bind(this));
            }
        }.bind(this));
    
    
    
     
        
    
};



module.exports=RedisCacheOperator;