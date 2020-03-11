# memory
memory,One repo of boy distribute modality platform. Support web Intelligent&distribute data memory cache functions such as temp cache data storage, data operation of platform level input&amp;output, temp cache/flash data persistance and so on.

#license policy
"license": "MPL(Mozilla Public License2.0)"
"comments": "Any unauthoritied using risk won't be charged to current platform developper-boybian. Meanwhile,thanks each every person who pushed this platform to be built"

#Why memory
1.If you want to split your original database/database-cluster's content into several diff level web distribute cache and raise up your platform's performance,you can use memory.
2.If you want to use database cluster which was hosted by diskData-role with memory-role together under boyplatform,you can use memory.

#Current bussiness DB type supported by this micro-service role
MySql,MsSql

#如何使用[how to use]
1.首先请在你将部署本微服务的容器/虚拟机/IOT下位机中配置安装nodejs环境以及mysql，mysql将作为该微服务的localDB用于微服务运行数据与逻辑数据的存储与处理。
1.First of all, Please install nodejs environment and mysql into the container/virtual machine/IOT lower computer which you want to deploy this micro-service to, the mysql will be used as current micro-service's localDB to store and process operation data & logical data of current micro-service node.

2.接下来请在部署目标容器/虚拟机/IOT下位机中的mysql上运行repo中mysql localDB的初始化脚本。
2.Then, Please run the sql script under current github repo to init mysql localDB's structure on your deployment-target service container/virtual machine/ IOT lower computer .


3.如果你想在开发环境中调试本微服务，你可手动复制整个项目到测试使用的容器/虚拟机/IOT下位机中,同时根据你项目的实际情况配置src中的config文件，运行npm install初始化依赖模块后进入webApi目录并运行node memoryEntry.js启动整个微服务。
   如果你想在生产环境中使用本微服务并且你拥有一个devops团队，你可将预部署的容器/虚拟机/IOT下位机 IP及端口配置到ansible的主机清单中，同时为src的config文件制作一个ansible jinjia2的模板并把常用配置参数配在ansible的var中，最后为你的部署目标服务器写一个playbook，在playbook最后的任务里进入webApi目录并运行node memoryEntry.js启动整个微服务，最后把该部署动作整合到你jenkins的deployment pipeline中。
   如果你需要负载均衡以及更安全的内外网服务器分离，你可以将ansible主机清单中的终端IP配置给一台nginx服务作为集群的反向代理服务出口。
3.If you want to debug or try this micro-service on your dev environment,you can copy entire project to your deployment-target service container/virtual machine/ IOT lower computer，meanwhile config the config file under src folder per your actual project's requirements,then run 'npm install' to init node modules and go into webApi folder and run 'node memoryEntry.js' to lauch the mirco-service.
   If you want to use this micro-service on your prod environment and you have a devops team,you can put your pre deploy service container/virtual machine/ IOT lower computer’s IP into ansible inventory host file, meanwhile prepare an ansible jinjia2 template for the config file under src and prepare its config-var under ansible var, then you can prepare a playbook to deploy it to your deployment-target services,at last task of the playbook you can go into webApi folder and run 'node memoryEntry.js' to lauch the mirco-service.
   At last,you can integrate this deployment action into your Jenkins deployment pipeline.
   If you need load-balance and isolate interal and external network for your security, you can config the terminal IPs of your ansible inventory into a nginx service and let it be exit of your messageQueue cluster.
   

4.如果你想调试这个微服务的整套restful API，可使用fiddler尝试运行如下报文。
4.If you want to debug this micro-service's restful API,you can use fiddler to run below post message to related API.
  
  ---- 写入操作(write memory) ---- 
 
	url:  http://www.boyMemory.com/memData
	User-Agent: Fiddler
	Host: www.boyMemory.com
	Content-Length: 135
	content-type: application/json
	
	--访问基于Mssql部署的diskData集群(For mssql diskData cluster)
	message body:
	{
	 "messageAction":"write",
	 "targetDbName":"efcoreTest",
	 "writeSql":"insert into students(stuName) values (#stuName)",
	 "writeSqlParameter":{"#stuName":"'test_mssql'"},
	 "blockVerifyOrNot":true,
	 "reqStorageClusterDbType":1  //For mssql diskData cluster

	}
	
	--访问基于mysql部署的diskData集群(For mysql diskData cluster)
	message body:
	{
		"messageAction":"write",
		"targetDbName":"board_usb",
		"writeSql":"insert into platformUser  (platformUserGuid,platformUserName,platformUserPwd,systemRole) value(#platformUserGuid,#platformUserName,#platformUserPwd,#systemRole)",
		"writeSqlParameter":{"#platformUserGuid":"'ffc2d917-7163-4bb0-a455-76c6404e846a-20882088'",
										"#platformUserName":"'boybian16'",
										 "#platformUserPwd":"'58b1216b06850385d9a4eadbedc806c4'",
										 "#systemRole":"1"
										},
	 "blockVerifyOrNot":true,
	 "reqStorageClusterDbType":0 //For mysql diskData cluster

	}
	
	---- 读取操作(read memory) ----
	--访问基于Mssql部署的diskData集群(For mssql diskData cluster)
	message body:
	{
	 "messageAction":"read",
	 "targetDbName":"efcoreTest",
	 "keyObjName":"student",
	 "keyObjType":"2",
	 "cacheGenMethod":"3",
	 "ttl":"100",
	 "querySql":"select * from students where stuName='#stuName'",
	 "querySqlParameter":{"#stuName":"test888"},
	 "mocktype":"nodeCacheOperator",   //nodeCacheOperator，memCacheOperator,redisCacheOperator,localFeedDiskOperator, these is only used for test diff level's cache health,in prod or uat evironment,please remove this field.
	 "reqStorageClusterDbType":1  //For mssql diskData cluster
	}
	
	--访问基于mysql部署的diskData集群(For mysql diskData cluster)
	message body:
	{
	 "messageAction":"read",
	 "targetDbName":"board_usb",
	 "keyObjName":"platformUser",
	 "keyObjType":"2",
	 "cacheGenMethod":"3",
	 "ttl":"100",
	 "querySql":"select * from platformUser where platformUserName='#platformUserName'",
	 "querySqlParameter":{"#platformUserName":"boybian16"},
	 "mocktype":"nodeCacheOperator",   //nodeCacheOperator，memCacheOperator,redisCacheOperator,localFeedDiskOperator, these is only used for test diff level's cache health,in prod or uat evironment,please remove this field.
	 "reqStorageClusterDbType":0  //For mysql diskData cluster
	}