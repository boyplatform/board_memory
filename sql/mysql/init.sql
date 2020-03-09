CREATE DATABASE `board_memory` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;

drop table if exists localFeedShadow;

/*==============================================================*/
/* Table: localFeedShadow                                       */
/*==============================================================*/
create table localFeedShadow
(
   localFeedId          bigint not null auto_increment,
   localFeedGuid        varchar(255) not null,
   feedPath             text,
   feedName             varchar(255),
   feedSize             bigint comment 'kb',
   createTime           datetime,
   updateTime           timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   keyObjName           varchar(255),
   feedExtName          varchar(255),
   keyObjType           int comment '0=string
            1=hashMapList
            2=tableList',
   valueSha             varchar(166),
   cacheGenMethod       int comment '0=DeamonThread
            1=Job
            2=ETL
            3=Query',
   querySqlSha          varchar(166),
   writeSqlSha          varchar(166),
   querySql             text,
   writeSql             text,
   ttl                  int comment 'expired seconds',
   targetDbName         varchar(255),
   value                text,
   reqStorageClusterDbType int comment '0=mysql
            1=mssql
            2=db2
            3=oracle',
   primary key (localFeedId)
);


drop table if exists nodeCacheShadow;

/*==============================================================*/
/* Table: nodeCacheShadow                                       */
/*==============================================================*/
create table nodeCacheShadow
(
   nodeCacheId          bigint not null auto_increment,
   nodeCacheGuid        varchar(255),
   keyObjName           varchar(255),
   keyObjType           int comment '0=string
            1=hashMapList
            2=tableList',
   valueSha             varchar(166),
   createTime           datetime,
   updateTime           timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   value                text,
   cacheGenMethod       int comment '0=DeamonThread
            1=Job
            2=ETL
            3=Query',
   querySqlSha          varchar(166),
   writeSqlSha          varchar(166),
   querySql             text,
   writeSql             text,
   ttl                  int comment 'expired seconds',
   targetDbName         varchar(255),
   reqStorageClusterDbType int comment '0=mysql
            1=mssql
            2=db2
            3=oracle',
   primary key (nodeCacheId)
);


drop table if exists redisCacheShadow;

/*==============================================================*/
/* Table: redisCacheShadow                                      */
/*==============================================================*/
create table redisCacheShadow
(
   redisCacheId         bigint not null auto_increment,
   redisCacheGuid       varchar(255),
   keyObjName           varchar(255),
   keyObjType           int comment '0=string
            1=hashMapList
            2=tableList',
   valueSha             varchar(166),
   createTime           dateTime,
   updateTime           timeStamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   value                text,
   cacheGenMethod       int comment '0=DeamonThread
            1=Job
            2=ETL
            3=Query',
   querySqlSha          varchar(166),
   writeSqlSha          varchar(166),
   querySql             text,
   writeSql             text,
   ttl                  int comment 'expired seconds',
   targetDbName         varchar(255),
   reqStorageClusterDbType int comment '0=mysql
            1=mssql
            2=db2
            3=oracle',
   primary key (redisCacheId)
);


drop table if exists memCacheShadow;

/*==============================================================*/
/* Table: memCacheShadow                                        */
/*==============================================================*/
create table memCacheShadow
(
   memCacheId           bigint not null auto_increment,
   memCacheGuid         varchar(255),
   keyObjName           varchar(255),
   keyObjType           int comment '0=string
            1=hashMapList
            2=tableList',
   valueSha             varchar(166),
   createTime           dateTime,
   updateTime           timeStamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   value                text,
   cacheGenMethod       int comment '0=DeamonThread
            1=Job
            2=ETL
            3=Query',
   querySqlSha          varchar(166),
   writeSqlSha          varchar(166),
   querySql             text,
   writeSql             text,
   ttl                  int comment 'expired seconds',
   targetDbName         varchar(255),
   reqStorageClusterDbType int comment '0=mysql
            1=mssql
            2=db2
            3=oracle',
   primary key (memCacheId)
);


drop table if exists DBUpgradeHistory;

/*==============================================================*/
/* Table: DBUpgradeHistory                                      */
/*==============================================================*/
create table DBUpgradeHistory
(
   nodeDbUpgradeHIstoryId bigint not null auto_increment,
   nodeDbGuid           varchar(255),
   nodeDbName           varchar(255),
   fromPlatformDbVersion bigint,
   toPlatformDbVersion  bigint,
   upgradeTime          timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   currentPlatformUser  bigint,
   platformUserLoginName varchar(255),
   platformUserName     varchar(255),
   platformHostGuid     varchar(255),
   comments             varchar(255),
   nodeDbUpgradeHIstoryGuid varchar(255),
   isActive             bit default 1,
   primary key (nodeDbUpgradeHIstoryId)
);

drop table if exists customerDbList;

/*==============================================================*/
/* Table: customerDbList                                        */
/*==============================================================*/
create table customerDbList
(
   id                   bigint not null auto_increment,
   guid                 varchar(255) not null,
   dataSourceClassName  varchar(255),
   dataSourceUser       varchar(255),
   dataSourcePassword   varchar(255),
   dataSourceDataBaseName varchar(255),
   dataSourcePortNumber bigint default 3306,
   dataSourceServerName varchar(255),
   remark               varchar(255),
   dbTypeNum            bigint default 0,
   isActive             bit default 1,
   createTime           datetime,
   updateTime           timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   primary key (id)
);

alter table customerDbList comment 'config except nodeDB, which third party injected datasource ';

drop table if exists crystalClusterBlock;

/*==============================================================*/
/* Table: crystalClusterBlock                                   */
/*==============================================================*/
create table crystalClusterBlock
(
   crystalNodeId        bigint not null auto_increment,
   crystalNodeGuid      varchar(255),
   crystalNodeIp        varchar(66),
   crystalNodePort      bigint default 666,
   interactProtocolType int default 0 comment '0=http
            1=tcp
            2=udp',
   mem_totalHeap        double,
   mem_heapUsed         double,
   mem_totalForCurrentProcess double,
   mem_totalOnV8EngineUsing double,
   mem_usedMemRate      double comment '%',
   cpuArch              varchar(255) comment 'os.arch()',
   cpuInfo              varchar(2048) comment 'os.cpus()',
   freemem              bigint comment 'os.freemem(),byte',
   hostName             varchar(255) comment 'os.hostname()',
   loadAvg              varchar(255) comment 'os.loadavg()',
   networkInterface     varchar(10240) comment 'os.networkInterface()',
   platformtype         varchar(255) comment 'os.platform()',
   platformVersion      varchar(255) comment 'os.release()',
   osTempDir            varchar(255) comment 'os.tmpdir()',
   totalMemory          bigint comment 'os.totalmem(),byte',
   osType               varchar(255) comment 'os.type(), base on linux=linux, base on apple=Darwin,base on win=Windows_NT',
   nodeNormalRunedTime  bigint comment 'os.uptime()',
   crstalNodeRole       int comment '0=master
            1=worker',
   primary key (crystalNodeId)
);

drop table if exists unitNodeRelation;

/*==============================================================*/
/* Table: unitNodeRelation                                      */
/*==============================================================*/
create table unitNodeRelation
(
   r_crystalNodeId      bigint,
   appId                bigint,
   r_crystalNodeGuid    varchar(255),
   isActive             bit default 1,
   createTime           datetime,
   updateTime           timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   unitNodeRelationId   bigint not null auto_increment,
   unitNodeRelationGuid varchar(255),
   unitNodeRole         bigint,
   unitNodeSource       int comment '0=managed under devops
            1=network seed',
   unitNodeIp           varchar(66),
   unitNodePort         bigint,
   unitNodeProtocolType int comment '0=http
            1=tcp
            2=udp',
   mem_totalHeap        double,
   mem_heapUsed         double,
   mem_totalForCurrentProcess double,
   mem_totalOnV8EngineUsing double,
   mem_usedMemRate      double,
   cpuArch              varchar(255),
   cpuInfo              varchar(2048),
   freemem              bigint,
   hostName             varchar(255),
   loadAvg              varchar(255),
   networkInterface     varchar(1024),
   platformtype         varchar(255),
   platformVersion      varchar(255),
   osTempDir            varchar(255),
   totalMemory          bigint,
   osType               varchar(255),
   nodeNormalRunedTime  bigint,
   primary key (unitNodeRelationId)
);

alter table unitNodeRelation comment 'define some particular relationship between unitnode and pla';

drop table if exists crystalMasterVote;

/*==============================================================*/
/* Table: crystalMasterVote                                     */
/*==============================================================*/
create table crystalMasterVote
(
   crystalNodeId        bigint not null,
   crystalNodeGuid      varchar(255) not null,
   lastVoteMeNodesIps   varchar(255),
   lastVotePerformanceDump varchar(2048),
   lastVoteCount        bigint,
   createTime           datetime,
   updateTime           timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   crystalNodeIp        varchar(255),
   crystalNodePort      bigint,
   interactProtocolType int comment '0=http
            1=tcp
            2=udp
            3=https',
   primary key (crystalNodeId)
);
