var mssqlConf = {
    user: 'sa',
    password: 'Saboy3210',
    server: 'B4E62ROkd-29j',
    database: 'PerformanceTest',
    port: 2048,
    options: {
    encrypt: false // Use this if you're on Windows Azure=true
    }, 
    pool: {
        min: 0,
        max: 300,
        idleTimeoutMillis: 3000
    }
};

var mysqlConf = {

     dbConfig:{
        host: '127.0.0.1',
        user: 'root',
        port: 3306,
        password:'whoisboy',
        database: 'board_memory'

     },
     onError: function(err){
        console.dir(err);
     },
     customError: null,
     timeout: 3000,
     debug: false
};

var memCachedPoolConfig={
   'host': ['192.168.125.132:11166','192.168.125.133:11166'],
   'connectionLimit': '66',
   'timeout' : 50000
};

var redisPoolConfig={
   host:"192.168.125.134",
   port:6666,
   opts:{}
};

var redisClusterPoolConfig=[
   {
      port:6666,
      host:"192.168.125.134"
   },
   {
      port:6666,
      host:"192.168.125.135"
   },
   {
      port:6666,
      host:"192.168.125.136"
   },
   {
      port:6666,
      host:"192.168.125.137"
   },
   {
      port:6666,
      host:"192.168.125.138"
   },
   {
      port:6666,
      host:"192.168.125.139"
   }
];

var platformArch= {
   
     defaultHttpReqTimeOut:6000,
     diskDataApiUrl:"127.0.0.1:8080", //www.boyDiskData.com:80
     diskDataMssqlApiUrl:"127.0.0.1:8080",
     shaHashLengh:36,
     shaHashTimes:3,
     DeamonThreadSecRate:{
       forShadowGACExecute:20,
       forLocalFeedDiskDORSchedule:30,
       forMemCacheDORSchedule:30,
       forNodeCacheDORSchedule:30,
       forRedisCacheDORSchedule:30,
       forNodePerformanceCollection:20,
       forMasterNodeSelfSelection:60,
       forMasterNodeMeetingSelection:90,
       forEffectiveMasterNodeVoteResult:120,
       forTimelySelectionVoteResultClear:900,
       forGetCurrentNodeRolePromiseTime:50
     },
     crystalCluster:{
        interactProtocolType:0,
        httpDefaultMode:"http",
        ip1:'127.0.0.1:8080',
        ip2:'127.0.0.1:8080',
        ip3:'127.0.0.1:8080',
        ip4:'127.0.0.1:8080'
     },
     redisMode:"cluster",
     NonBlockChainPublishChannel:"NONBLOCKCHAINWRITE",
     localFeedPath:"../boyNodeMemory/localFeeds/"  //for linux:remove boyNodeMemory
    
};

exports.mssqlConfig = mssqlConf;
exports.mysqlConfig = mysqlConf;
exports.platformArch=platformArch;
exports.redisPoolConfig=redisPoolConfig;
exports.memCachedPoolConfig=memCachedPoolConfig;
exports.redisClusterPoolConfig=redisClusterPoolConfig;