'use strict'
const memoryHttpHelper=require('../src/boyMemoryHttpHelper')
var conf=require("../src/config");
function DiskDataTalker(){

}

DiskDataTalker.prototype.seekDataFromDiskData=function(reqStorageClusterDbType,querySql,callback){
    
    var domainUrl="";
    if(reqStorageClusterDbType.toString()==='0'){
        domainUrl=conf.platformArch.diskDataApiUrl;
    }else if(reqStorageClusterDbType.toString()==='1')
    {
        domainUrl=conf.platformArch.diskDataMssqlApiUrl;
    }
    var partialUrl="/getDiskData";
    var qs=""
    var timeout=conf.platformArch.defaultHttpReqTimeOut;
    var body={
        'querySql':querySql
    };
    memoryHttpHelper.apiSimpleRequestWithCallBack(conf.platformArch.crystalCluster.httpDefaultMode,domainUrl,partialUrl,qs,body,timeout,function(res){

        if(res!=undefined&&res!=null&&res["result"]!==[]){
            //console.log("seeked data from diskData as below:",JSON.stringify(res));
            callback(JSON.stringify(res["result"]));
        }else{
            console.log("seeked data from diskData failed");
            callback(JSON.stringify([]));
        }
    });
}

module.exports=DiskDataTalker;
