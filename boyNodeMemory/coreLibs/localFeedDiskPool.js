'use strict'
var fs=require("fs");
var path=require("path");
var memoryCommon=require('../src/boyMemoryCommon.js');
var conf=require('../src/config')

function LocalFeedDiskPool(localFeedPath) {
   
    if(localFeedPath===""||localFeedPath===undefined){
        this.localFeedPath=conf.platformArch.localFeedPath;
    }else{
        this.localFeedPath=localFeedPath;
    }
}

//set
LocalFeedDiskPool.prototype.set = function(key, value, options, callback) {

    memoryCommon.writeTextDataToFile(path.join(this.localFeedPath,key.toString()+".txt"),value,function(err,result){
 
           if(result){
                // Set TTL
                if (options.ttl) {
                    setTimeout(() => {
                        memoryCommon.deleteFile(path.join(this.localFeedPath,key.toString()+".txt"),function(result){
                           
                            if(result){
                                console.log("One local feed disk-cache-file:",path.join(this.localFeedPath,key.toString()+".txt")," has been removed successfully.");
                            }    
                        }.bind(this));
                    }, options.ttl*1000)
                }
                return callback(null,true);
           }else{
                return callback(err,false);
           }

    }.bind(this));

};


//get
LocalFeedDiskPool.prototype.get=function(key, callback) {
    
    memoryCommon.readTextDataFromFile(path.join(this.localFeedPath,key.toString()+".txt"),function(err,data){
        
        if(err){
            console.log("get data from one local feed disk-cache-file:",path.join(this.localFeedPath,key.toString()+".txt")," once failed.");
            callback(err,undefined);

        }else if(data!==undefined){
            console.log("get data from one local feed disk-cache-file:",path.join(this.localFeedPath,key.toString()+".txt")," once successfully.");
            callback(null,data);
        }else{

            console.log("get data from one local feed disk-cache-file:",path.join(this.localFeedPath,key.toString()+".txt")," once failed.");
            callback(null,undefined);
        }

    }.bind(this));
};


//del
LocalFeedDiskPool.prototype.del=function(key, callback) {
    
    memoryCommon.deleteFile(paht.join(this.localFeedPath,key.toString()+".txt"),function(result){
         
          if(result){
               console.log("delete one local feed disk-cache-file:",path.join(this.localFeedPath,key.toString()+".txt"," successfully."));
               callback(result);
          }else{
               console.log("delete one local feed disk-cache-file:",path.join(this.localFeedPath,key.toString()+".txt"," failed."));
               callback(result);
          }
       
    }.bind(this));
};



module.exports=LocalFeedDiskPool;


