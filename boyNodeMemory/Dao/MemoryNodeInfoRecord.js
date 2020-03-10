'use strict'
var MemoryDbHelper= require('./boyMemoryDBHelper');
var MemoryDb=new MemoryDbHelper();
//var LocalFeedShadow=require('../pojo/localFeedShadow');
//var localFeedShadow=new LocalFeedShadow();

function MemoryNodeInfoRecord(){

};

//localFeedShadow insert,update,select,delete
MemoryNodeInfoRecord.prototype.localFeedShadowInsert=function(localFeedShadow){

     
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql = "insert into localFeedShadow (localFeedGuid,feedPath,feedName,feedSize,createTime,updateTime,keyObjName,feedExtName,keyObjType,valueSha,cacheGenMethod,querySqlSha,writeSqlSha,querySql,writeSql,ttl,targetDbName,value,reqStorageClusterDbType) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    MemoryDb.mysqlParameter.common.params = [localFeedShadow.localFeedGuid,localFeedShadow.feedPath,localFeedShadow.feedName,localFeedShadow.feedSize,localFeedShadow.createTime,localFeedShadow.updateTime,localFeedShadow.keyObjName,localFeedShadow.feedExtName,localFeedShadow.keyObjType,localFeedShadow.valueSha,localFeedShadow.cacheGenMethod,localFeedShadow.querySqlSha,localFeedShadow.writeSqlSha,localFeedShadow.querySql,localFeedShadow.writeSql,localFeedShadow.ttl,localFeedShadow.targetDbName,localFeedShadow.value,localFeedShadow.reqStorageClusterDbType];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             
              console.log(success,"--localFeedShadow is inserted successfully!");
              return true;
          }

        }
      
    }
    MemoryDb.add();
};

MemoryNodeInfoRecord.prototype.localFeedShadowUpdate=function(localFeedShadow){   
   
    MemoryDb.dbType = 'mysql';    
    MemoryDb.mysqlParameter.common.sql ="update localFeedShadow set feedPath=?,feedName=?,feedSize=?,createTime=?,updateTime=?,keyObjName=?,feedExtName=?,keyObjType=?,valueSha=?,cacheGenMethod=?,querySqlSha=?,writeSqlSha=?,querySql=?,writeSql=?,ttl=?,targetDbName=? where localFeedGuid=?";
    MemoryDb.mysqlParameter.common.params=[localFeedShadow.feedPath,localFeedShadow.feedName,localFeedShadow.feedSize,localFeedShadow.createTime,localFeedShadow.updateTime,localFeedShadow.keyObjName,localFeedShadow.feedExtName,localFeedShadow.keyObjType,localFeedShadow.valueSha,localFeedShadow.cacheGenMethod,localFeedShadow.querySqlSha,localFeedShadow.writeSqlSha,localFeedShadow.querySql,localFeedShadow.writeSql,localFeedShadow.ttl,localFeedShadow.targetDbName,localFeedShadow.localFeedGuid];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--localFeedShadow is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    }
    MemoryDb.update();
  };

  MemoryNodeInfoRecord.prototype.localFeedShadowSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    MemoryDb.dbType = 'mysql';    
    MemoryDb.mysqlParameter.select.tableName='localFeedShadow';
    MemoryDb.mysqlParameter.select.topNumber=topNumber;
    MemoryDb.mysqlParameter.select.whereSql=whereSql;
    MemoryDb.mysqlParameter.select.params=params;
    MemoryDb.mysqlParameter.select.orderSql=orderBySql;
    MemoryDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to localFeedShadowSelect from current node db')
         if(err)
         {
            console.log('Failed to localFeedShadowSelect from current node db');  
            callBack(undefined); 
         }
         else
         {
            callBack(rows); 
           
         }
    };
    MemoryDb.select();
}

MemoryNodeInfoRecord.prototype.localFeedShadowDelete=function(localFeedId){
    
    MemoryDb.dbType = 'mysql'; 
    MemoryDb.mysqlParameter.del.tableName="localFeedShadow";
    MemoryDb.mysqlParameter.del.whereSql="where localFeedId=?";
    MemoryDb.mysqlParameter.del.params=[localFeedId];
    MemoryDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--localFeedShadow is deleted successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.del();   
}

//nodeCacheShadow insert,update,select,delete
MemoryNodeInfoRecord.prototype.nodeCacheShadowInsert=function(nodeCacheShadow){
    
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql = "insert into nodeCacheShadow (nodeCacheGuid,keyObjName,keyObjType,valueSha,createTime,updateTime,value,cacheGenMethod,querySqlSha,writeSqlSha,querySql,writeSql,ttl,targetDbName,reqStorageClusterDbType) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    MemoryDb.mysqlParameter.common.params = [nodeCacheShadow.nodeCacheGuid,nodeCacheShadow.keyObjName,nodeCacheShadow.keyObjType,nodeCacheShadow.valueSha,nodeCacheShadow.createTime,nodeCacheShadow.updateTime,nodeCacheShadow.value,nodeCacheShadow.cacheGenMethod,nodeCacheShadow.querySqlSha,nodeCacheShadow.writeSqlSha,nodeCacheShadow.querySql,nodeCacheShadow.writeSql,nodeCacheShadow.ttl,nodeCacheShadow.targetDbName,nodeCacheShadow.reqStorageClusterDbType];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--nodeCacheShadow is inserted successfully!");
                return true;
             }else{
                return false;
             }
          }

        }
      
    }
    MemoryDb.add();
};

MemoryNodeInfoRecord.prototype.nodeCacheShadowUpdate=function(nodeCacheShadow){

    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="update nodeCacheShadow set keyObjName=?,keyObjType=?,valueSha=?,createTime=?,updateTime=?,value=?,cacheGenMethod=?,querySqlSha=?,writeSqlSha=?,querySql=?,writeSql=?,ttl=?,targetDbName=? where nodeCacheGuid=?";
    MemoryDb.mysqlParameter.common.params=[nodeCacheShadow.keyObjName,nodeCacheShadow.keyObjType,nodeCacheShadow.valueSha,nodeCacheShadow.createTime,nodeCacheShadow.updateTime,nodeCacheShadow.value,nodeCacheShadow.cacheGenMethod,nodeCacheShadow.querySqlSha,nodeCacheShadow.writeSqlSha,nodeCacheShadow.querySql,nodeCacheShadow.writeSql,nodeCacheShadow.ttl,nodeCacheShadow.targetDbName,nodeCacheShadow.nodeCacheGuid];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--nodeCacheShadow is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.update();
};

MemoryNodeInfoRecord.prototype.nodeCacheShadowSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    MemoryDb.dbType = 'mysql';    
    MemoryDb.mysqlParameter.select.tableName='nodeCacheShadow';
    MemoryDb.mysqlParameter.select.topNumber=topNumber;
    MemoryDb.mysqlParameter.select.whereSql=whereSql;
    MemoryDb.mysqlParameter.select.params=params;
    MemoryDb.mysqlParameter.select.orderSql=orderBySql;
    MemoryDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to nodeCacheShadowSelect from current node db')
         if(err)
         {
           console.log('Failed to nodeCacheShadowSelect from current node db');  
           callBack(undefined); 
         }
         else
         {
           
           callBack(rows); 
         }
    };
    MemoryDb.select();
};

MemoryNodeInfoRecord.prototype.nodeCacheShadowDelete=function(nodeCacheId){
    
    MemoryDb.dbType = 'mysql'; 
    MemoryDb.mysqlParameter.del.tableName="nodeCacheShadow";
    MemoryDb.mysqlParameter.del.whereSql="where nodeCacheId=?";
    MemoryDb.mysqlParameter.del.params=[nodeCacheId];
    MemoryDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--nodeCacheShadow is deleted successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.del();
}


//redisCacheShadow insert,update,select,delete
MemoryNodeInfoRecord.prototype.redisCacheShadowInsert=function(redisCacheShadow){
    
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql = "insert into redisCacheShadow (redisCacheGuid,keyObjName,keyObjType,valueSha,createTime,updateTime,value,cacheGenMethod,querySqlSha,writeSqlSha,querySql,writeSql,ttl,targetDbName,reqStorageClusterDbType) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    MemoryDb.mysqlParameter.common.params = [redisCacheShadow.redisCacheGuid,redisCacheShadow.keyObjName,redisCacheShadow.keyObjType,redisCacheShadow.valueSha,redisCacheShadow.createTime,redisCacheShadow.updateTime,redisCacheShadow.value,redisCacheShadow.cacheGenMethod,redisCacheShadow.querySqlSha,redisCacheShadow.writeSqlSha,redisCacheShadow.querySql,redisCacheShadow.writeSql,redisCacheShadow.ttl,redisCacheShadow.targetDbName,redisCacheShadow.reqStorageClusterDbType];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
             
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--redisCacheShadow is inserted successfully!");
               
             }else{
                console.log(success,"--redisCacheShadow is inserted failed!");
             }
          }

        }
      
    };
    MemoryDb.add();
};

MemoryNodeInfoRecord.prototype.redisCacheShadowUpdate=function(redisCacheShadow){

    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="update redisCacheShadow set keyObjName=?,keyObjType=?,valueSha=?,createTime=?,updateTime=?,value=?,cacheGenMethod=?,querySqlSha=?,writeSqlSha=?,querySql=?,writeSql=?,ttl=?,targetDbName=? where redisCacheGuid=?";
    MemoryDb.mysqlParameter.common.params=[redisCacheShadow.keyObjName,redisCacheShadow.keyObjType,redisCacheShadow.valueSha,redisCacheShadow.createTime,redisCacheShadow.updateTime,redisCacheShadow.value,redisCacheShadow.cacheGenMethod,redisCacheShadow.querySqlSha,redisCacheShadow.writeSqlSha,redisCacheShadow.querySql,redisCacheShadow.writeSql,redisCacheShadow.ttl,redisCacheShadow.targetDbName,redisCacheShadow.redisCacheGuid];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--redisCacheShadow is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.update();
};

MemoryNodeInfoRecord.prototype.redisCacheShadowSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    MemoryDb.dbType = 'mysql';    
    MemoryDb.mysqlParameter.select.tableName='redisCacheShadow';
    MemoryDb.mysqlParameter.select.topNumber=topNumber;
    MemoryDb.mysqlParameter.select.whereSql=whereSql;
    MemoryDb.mysqlParameter.select.params=params;
    MemoryDb.mysqlParameter.select.orderSql=orderBySql;
    MemoryDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to redisCacheShadowSelect from current node db')
         if(err)
         {
           console.log('Failed to redisCacheShadowSelect from current node db');  
           callBack(undefined); 
         }
         else
         {
           callBack(rows); 
          
           
         }
    };
    MemoryDb.select();
};

MemoryNodeInfoRecord.prototype.redisCacheShadowDelete=function(redisCacheId){
   
    MemoryDb.dbType = 'mysql'; 
    MemoryDb.mysqlParameter.del.tableName="redisCacheShadow";
    MemoryDb.mysqlParameter.del.whereSql="where redisCacheId=?";
    MemoryDb.mysqlParameter.del.params=[redisCacheId];
    MemoryDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--redisCacheShadow is deleted successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.del();
}

//memCacheShadow insert,update,select,delete
MemoryNodeInfoRecord.prototype.memCacheShadowInsert=function(memCacheShadow){
    
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="insert into memCacheShadow (memCacheGuid,keyObjName,keyObjType,valueSha,createTime,updateTime,value,cacheGenMethod,querySqlSha,writeSqlSha,querySql,writeSql,ttl,targetDbName,reqStorageClusterDbType) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    MemoryDb.mysqlParameter.common.params = [memCacheShadow.memCacheGuid,memCacheShadow.keyObjName,memCacheShadow.keyObjType,memCacheShadow.valueSha,memCacheShadow.createTime,memCacheShadow.updateTime,memCacheShadow.value,memCacheShadow.cacheGenMethod,memCacheShadow.querySqlSha,memCacheShadow.writeSqlSha,memCacheShadow.querySql,memCacheShadow.writeSql,memCacheShadow.ttl,memCacheShadow.targetDbName,memCacheShadow.reqStorageClusterDbType];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--memCacheShadow is inserted successfully!");
                return true;
             }else{
                return false;
             }
          }

        }
      
    };
    MemoryDb.add();
};

MemoryNodeInfoRecord.prototype.memCacheShadowUpdate=function(memCacheShadow){

    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="update memCacheShadow set keyObjName=?,keyObjType=?,valueSha=?,createTime=?,updateTime=?,value=?,cacheGenMethod=?,querySqlSha=?,writeSqlSha=?,querySql=?,writeSql=?,ttl=?,targetDbName=? where memCacheGuid=?";
    MemoryDb.mysqlParameter.common.params=[memCacheShadow.keyObjName,memCacheShadow.keyObjType,memCacheShadow.valueSha,memCacheShadow.createTime,memCacheShadow.updateTime,memCacheShadow.value,memCacheShadow.cacheGenMethod,memCacheShadow.querySqlSha,memCacheShadow.writeSqlSha,memCacheShadow.querySql,memCacheShadow.writeSql,memCacheShadow.ttl,memCacheShadow.targetDbName,memCacheShadow.memCacheGuid];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--memCacheShadow is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.update();

};

MemoryNodeInfoRecord.prototype.memCacheShadowSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    MemoryDb.dbType = 'mysql';    
    MemoryDb.mysqlParameter.select.tableName='memCacheShadow';
    MemoryDb.mysqlParameter.select.topNumber=topNumber;
    MemoryDb.mysqlParameter.select.whereSql=whereSql;
    MemoryDb.mysqlParameter.select.params=params;
    MemoryDb.mysqlParameter.select.orderSql=orderBySql;
    MemoryDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to memCacheShadowSelect from current node db')
         if(err)
         {
            console.log('Failed to memCacheShadowSelect from current node db');  
            callBack(undefined);
         }
         else
         {
            callBack(rows);
           
         }
    };
    MemoryDb.select();
};

MemoryNodeInfoRecord.prototype.memCacheShadowDelete=function(memCacheId){
   
    MemoryDb.dbType = 'mysql'; 
    MemoryDb.mysqlParameter.del.tableName="memCacheShadow";
    MemoryDb.mysqlParameter.del.whereSql="where memCacheId=?";
    MemoryDb.mysqlParameter.del.params=[memCacheId];
    MemoryDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--memCacheShadow is deleted successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.del();
}


//crystalClusterBlock insert,update,select,delete
MemoryNodeInfoRecord.prototype.crystalClusterBlockInsert=function(crystalClusterBlock){
   
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="insert into crystalClusterBlock (crystalNodeGuid,crystalNodeIp,crystalNodePort,interactProtocolType,mem_totalHeap,mem_heapUsed,mem_totalForCurrentProcess,mem_totalOnV8EngineUsing,mem_usedMemRate,cpuArch,cpuInfo,freemem,hostName,loadAvg,networkInterface,platformtype,platformVersion,osTempDir,totalMemory,osType,nodeNormalRunedTime,crstalNodeRole) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    MemoryDb.mysqlParameter.common.params = [crystalClusterBlock.crystalNodeGuid,crystalClusterBlock.crystalNodeIp,crystalClusterBlock.crystalNodePort,crystalClusterBlock.interactProtocolType,crystalClusterBlock.mem_totalHeap,crystalClusterBlock.mem_heapUsed,crystalClusterBlock.mem_totalForCurrentProcess,crystalClusterBlock.mem_totalOnV8EngineUsing,crystalClusterBlock.mem_usedMemRate,crystalClusterBlock.cpuArch,crystalClusterBlock.cpuInfo,crystalClusterBlock.freemem,crystalClusterBlock.hostName,crystalClusterBlock.loadAvg,crystalClusterBlock.networkInterface,crystalClusterBlock.platformtype,crystalClusterBlock.platformVersion,crystalClusterBlock.osTempDir,crystalClusterBlock.totalMemory,crystalClusterBlock.osType,crystalClusterBlock.nodeNormalRunedTime,crystalClusterBlock.crstalNodeRole];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--crystalClusterBlock is inserted successfully!");
                return true;
             }else{
                return false;
             }
          }

        }
      
    };
    MemoryDb.add();
};

MemoryNodeInfoRecord.prototype.crystalClusterBlockUpdate=function(crystalClusterBlock){
    
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="update crystalClusterBlock set crystalNodeIp=?,crystalNodePort=?,interactProtocolType=?,mem_totalHeap=?,mem_heapUsed=?,mem_totalForCurrentProcess=?,mem_totalOnV8EngineUsing=?,mem_usedMemRate=?,cpuArch=?,cpuInfo=?,freemem=?,hostName=?,loadAvg=?,networkInterface=?,platformtype=?,platformVersion=?,osTempDir=?,totalMemory=?,osType=?,nodeNormalRunedTime=? where crystalNodeGuid=?";
    MemoryDb.mysqlParameter.common.params=[crystalClusterBlock.crystalNodeIp,crystalClusterBlock.crystalNodePort,crystalClusterBlock.interactProtocolType,crystalClusterBlock.mem_totalHeap,crystalClusterBlock.mem_heapUsed,crystalClusterBlock.mem_totalForCurrentProcess,crystalClusterBlock.mem_totalOnV8EngineUsing,crystalClusterBlock.mem_usedMemRate,crystalClusterBlock.cpuArch,crystalClusterBlock.cpuInfo,crystalClusterBlock.freemem,crystalClusterBlock.hostName,crystalClusterBlock.loadAvg,crystalClusterBlock.networkInterface,crystalClusterBlock.platformtype,crystalClusterBlock.platformVersion,crystalClusterBlock.osTempDir,crystalClusterBlock.totalMemory,crystalClusterBlock.osType,crystalClusterBlock.nodeNormalRunedTime,crystalClusterBlock.crystalNodeGuid];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--crystalClusterBlock is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.update();
};

MemoryNodeInfoRecord.prototype.crystalClusterBlockMasterUpdate=function(crystalClusterBlock){
    
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="update crystalClusterBlock set crstalNodeRole=? where crystalNodeIp=?";
    MemoryDb.mysqlParameter.common.params=[crystalClusterBlock.crstalNodeRole,crystalClusterBlock.crystalNodeIp];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--crystalClusterBlock master is updated successfully!");
                return true;
            }else{
                console.log(success,"--crystalClusterBlock master is updated failed!");
                return false;
            }
        }
    };
    MemoryDb.update();
};

MemoryNodeInfoRecord.prototype.crystalClusterBlockSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    MemoryDb.dbType = 'mysql';    
    MemoryDb.mysqlParameter.select.tableName='crystalClusterBlock';
    MemoryDb.mysqlParameter.select.topNumber=topNumber;
    MemoryDb.mysqlParameter.select.whereSql=whereSql;
    MemoryDb.mysqlParameter.select.params=params;
    MemoryDb.mysqlParameter.select.orderSql=orderBySql;
    MemoryDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to crystalClusterBlockSelect from current node db');
         if(err)
         {
           console.log('Failed to crystalClusterBlockSelect from current node db');  
           callBack(undefined);
         }
         else
         {
           callBack(rows);
           
         }
    };
    MemoryDb.select();
};


MemoryNodeInfoRecord.prototype.crystalClusterBlockDelete=function(crystalNodeIp,crystalNodePort,interactProtocolType,callback){
   
    MemoryDb.dbType = 'mysql'; 
    MemoryDb.mysqlParameter.del.tableName="crystalClusterBlock";
    MemoryDb.mysqlParameter.del.whereSql="where crystalNodeIp=? and crystalNodePort=? and interactProtocolType=?";
    MemoryDb.mysqlParameter.del.params=[crystalNodeIp,crystalNodePort,interactProtocolType];
    MemoryDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            callback(false);
        }else
        {
            if(success){
                console.log(success,"--crystalClusterBlock is deleted successfully!");
                callback(true);
            }else{
                callback(false);
            }
        }
    };
    MemoryDb.del();
}

//unitNodeRelation insert,update,select
MemoryNodeInfoRecord.prototype.unitNodeRelationInsert=function(unitNodeRelation){
    
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="insert into unitNodeRelation(appId,unitNodeGuid,isActive,createTime,updateTime,unitNodeRelationId,unitNodeRelationGuid,unitNodeRole,unitNodeSource,unitNodeIp,unitNodePort,unitNodeProtocolType,mem_totalHeap,mem_heapUsed,mem_totalForCurrentProcess,mem_totalOnV8EngineUsing,mem_usedMemRate,cpuArch,cpuInfo,freemem,hostName,loadAvg,networkInterface,platformtype,platformVersion,osTempDir,totalMemory,osType,nodeNormalRunedTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    MemoryDb.mysqlParameter.common.params = [unitNodeRelation.appId,unitNodeRelation.unitNodeGuid,unitNodeRelation.isActive,unitNodeRelation.createTime,unitNodeRelation.updateTime,unitNodeRelation.unitNodeRelationId,unitNodeRelation.unitNodeRelationGuid,unitNodeRelation.unitNodeRole,unitNodeRelation.unitNodeSource,unitNodeRelation.unitNodeIp,unitNodeRelation.unitNodePort,unitNodeRelation.unitNodeProtocolType,unitNodeRelation.mem_totalHeap,unitNodeRelation.mem_heapUsed,unitNodeRelation.mem_totalForCurrentProcess,unitNodeRelation.mem_totalOnV8EngineUsing,unitNodeRelation.mem_usedMemRate,unitNodeRelation.cpuArch,unitNodeRelation.cpuInfo,unitNodeRelation.freemem,unitNodeRelation.hostName,unitNodeRelation.loadAvg,unitNodeRelation.networkInterface,unitNodeRelation.platformtype,unitNodeRelation.platformVersion,unitNodeRelation.osTempDir,unitNodeRelation.totalMemory,unitNodeRelation.osType,unitNodeRelation.nodeNormalRunedTime];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--unitNodeRelation is inserted successfully!");
                return true;
             }else{
                return false;
             }
          }

        }
      
    };
    MemoryDb.add();
};

MemoryNodeInfoRecord.prototype.unitNodeRelationUpdate=function(unitNodeRelation){

    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="update unitNodeRelation set appId=?,isActive=?,createTime=?,updateTime=?,unitNodeRelationId=?,unitNodeRelationGuid=?,unitNodeRole=?,unitNodeSource=?,unitNodeIp=?,unitNodePort=?,unitNodeProtocolType=?,mem_totalHeap=?,mem_heapUsed=?,mem_totalForCurrentProcess=?,mem_totalOnV8EngineUsing=?,mem_usedMemRate=?,cpuArch=?,cpuInfo=?,freemem=?,hostName=?,loadAvg=?,networkInterface=?,platformtype=?,platformVersion=?,osTempDir=?,totalMemory=?,osType=?,nodeNormalRunedTime=? where unitNodeGuid=?";
    MemoryDb.mysqlParameter.common.params=[unitNodeRelation.appId,unitNodeRelation.isActive,unitNodeRelation.createTime,unitNodeRelation.updateTime,unitNodeRelation.unitNodeRelationId,unitNodeRelation.unitNodeRelationGuid,unitNodeRelation.unitNodeRole,unitNodeRelation.unitNodeSource,unitNodeRelation.unitNodeIp,unitNodeRelation.unitNodePort,unitNodeRelation.unitNodeProtocolType,unitNodeRelation.mem_totalHeap,unitNodeRelation.mem_heapUsed,unitNodeRelation.mem_totalForCurrentProcess,unitNodeRelation.mem_totalOnV8EngineUsing,unitNodeRelation.mem_usedMemRate,unitNodeRelation.cpuArch,unitNodeRelation.cpuInfo,unitNodeRelation.freemem,unitNodeRelation.hostName,unitNodeRelation.loadAvg,unitNodeRelation.networkInterface,unitNodeRelation.platformtype,unitNodeRelation.platformVersion,unitNodeRelation.osTempDir,unitNodeRelation.totalMemory,unitNodeRelation.osType,unitNodeRelation.nodeNormalRunedTime,unitNodeRelation.unitNodeGuid];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--unitNodeRelation is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.update();
};

MemoryNodeInfoRecord.prototype.unitNodeRelationSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    MemoryDb.dbType = 'mysql';    
    MemoryDb.mysqlParameter.select.tableName='unitNodeRelation';
    MemoryDb.mysqlParameter.select.topNumber=topNumber;
    MemoryDb.mysqlParameter.select.whereSql=whereSql;
    MemoryDb.mysqlParameter.select.params=params;
    MemoryDb.mysqlParameter.select.orderSql=orderBySql;
    MemoryDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to unitNodeRelationSelect from current node db');
         if(err)
         {
           console.log('Failed to unitNodeRelationSelect from current node db');  
           callBack(undefined);
         }
         else
         {
           callBack(rows);
           
         }
    };
    MemoryDb.select();
};

//crystalMasterVote insert,update,select
MemoryNodeInfoRecord.prototype.crystalMasterVoteInsert=function(crystalMasterVote){
    
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="insert into crystalMasterVote(crystalNodeId,crystalNodeGuid,lastVoteMeNodesIps,lastVotePerformanceDump,lastVoteCount,createTime,updateTime,crystalNodeIp,crystalNodePort,interactProtocolType) values (?,?,?,?,?,?,?,?,?,?)";
    MemoryDb.mysqlParameter.common.params = [crystalMasterVote.crystalNodeId,crystalMasterVote.crystalNodeGuid,crystalMasterVote.lastVoteMeNodesIps,crystalMasterVote.lastVotePerformanceDump,crystalMasterVote.lastVoteCount,crystalMasterVote.createTime,crystalMasterVote.updateTime,crystalMasterVote.crystalNodeIp,crystalMasterVote.crystalNodePort,crystalMasterVote.interactProtocolType];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--crystalMasterVote is inserted successfully!");
                return true;
             }else{
                return false;
             }
          }

        }
      
    };
    MemoryDb.add();
};

MemoryNodeInfoRecord.prototype.crystalMasterVoteUpdate=function(crystalMasterVote){

    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="update crystalMasterVote set lastVoteMeNodesIps=?,lastVotePerformanceDump=?,lastVoteCount=?,createTime=?,updateTime=?,crystalNodeIp=?,crystalNodePort=?,interactProtocolType=? where crystalNodeGuid=?";
    MemoryDb.mysqlParameter.common.params = [crystalMasterVote.lastVoteMeNodesIps,crystalMasterVote.lastVotePerformanceDump,crystalMasterVote.lastVoteCount,crystalMasterVote.createTime,crystalMasterVote.updateTime,crystalMasterVote.crystalNodeIp,crystalMasterVote.crystalNodePort,crystalMasterVote.interactProtocolType,crystalMasterVote.crystalNodeGuid];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--crystalMasterVote is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.update();
};

MemoryNodeInfoRecord.prototype.crystalMasterVoteClear=function(crystalMasterVote){

    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="update crystalMasterVote set lastVoteCount=? where crystalNodeGuid=?";
    MemoryDb.mysqlParameter.common.params = [crystalMasterVote.lastVoteCount,crystalMasterVote.crystalNodeGuid];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--crystalMasterVote count is cleared successfully!");
                return true;
            }else{
                console.log(success,"--crystalMasterVote count is cleared failed!");
                return false;
            }
        }
    };
    MemoryDb.update();
};


MemoryNodeInfoRecord.prototype.crystalMasterVoteSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    MemoryDb.dbType = 'mysql';    
    MemoryDb.mysqlParameter.select.tableName='crystalMasterVote';
    MemoryDb.mysqlParameter.select.topNumber=topNumber;
    MemoryDb.mysqlParameter.select.whereSql=whereSql;
    MemoryDb.mysqlParameter.select.params=params;
    MemoryDb.mysqlParameter.select.orderSql=orderBySql;
    MemoryDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to crystalMasterVoteSelect from current node db');
         if(err)
         {
            console.log('Failed to crystalMasterVoteSelect from current node db');  
            callBack(undefined);
         }
         else
         {
            callBack(rows);
           
         }
    };
    MemoryDb.select();
};

//customerDbList insert,update,select
MemoryNodeInfoRecord.prototype.customerDbListInsert=function(customerDbList){
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="insert into customerDbList(guid,dataSourceClassName,dataSourceUser,dataSourcePassword,dataSourceDataBaseName,dataSourcePortNumber,dataSourceServerName,remark,dbTypeNum,isActive,createTime) values (?,?,?,?,?,?,?,?,?,?,?)";
    MemoryDb.mysqlParameter.common.params = [customerDbList.guid,customerDbList.dataSourceClassName,customerDbList.dataSourceUser,customerDbList.dataSourcePassword,customerDbList.dataSourceDataBaseName,customerDbList.dataSourcePortNumber,customerDbList.dataSourceServerName,customerDbList.remark,customerDbList.dbTypeNum,customerDbList.isActive,customerDbList.createTime];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--customerDbList is inserted successfully!");
                return true;
             }else{
                return false;
             }
          }

        }
      
    };
    MemoryDb.add();
};

MemoryNodeInfoRecord.prototype.customerDbListUpdate=function(customerDbList){
    MemoryDb.dbType = 'mysql';
    MemoryDb.mysqlParameter.common.sql ="update customerDbList set dataSourceClassName=?,dataSourceUser=?,dataSourcePassword=?,dataSourceDataBaseName=?,dataSourcePortNumber=?,dataSourceServerName=?,remark=?,dbTypeNum=?,isActive=? where guid=?";
    MemoryDb.mysqlParameter.common.params = [customerDbList.dataSourceClassName,customerDbList.dataSourceUser,customerDbList.dataSourcePassword,customerDbList.dataSourceDataBaseName,customerDbList.dataSourcePortNumber,customerDbList.dataSourceServerName,customerDbList.remark,customerDbList.dbTypeNum,customerDbList.isActive,customerDbList.guid];
    MemoryDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--customerDbList is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    MemoryDb.update();
};

MemoryNodeInfoRecord.prototype.customerDbListSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    MemoryDb.dbType = 'mysql';    
    MemoryDb.mysqlParameter.select.tableName='customerDbList';
    MemoryDb.mysqlParameter.select.topNumber=topNumber;
    MemoryDb.mysqlParameter.select.whereSql=whereSql;
    MemoryDb.mysqlParameter.select.params=params;
    MemoryDb.mysqlParameter.select.orderSql=orderBySql;
    MemoryDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to customerDbListSelect from current node db');
         if(err)
         {
            console.log('Failed to customerDbListSelect from current node db');  
            callBack(undefined);
         }
         else
         {
            callBack(rows);
           
         }
    };
    MemoryDb.select();
};


module.exports = MemoryNodeInfoRecord;