'use strict'
var Memcached = require('memcached');
var poolModule = require('generic-pool');
var pool=undefined;

function MemcachedPool(config) {
     
    this.setPool(config);
   
};

MemcachedPool.prototype.constructor=MemcachedPool;

MemcachedPool.prototype.setPool = function(config) {

    console.log("init pool for memcached start..");
    if(pool===undefined)
    {
          pool= poolModule.createPool(
           {
                create: function(){     
                var memcached = new Memcached(config.host, {debug: true});
                    memcached.on("failure", function (detail) {console.log(detail);})
                            .on('connect', function (detail) {console.log(detail);})
                            .on('reconnect', function (detail) {console.log(detail);})
                            .on('reconnecting', function (detail) {console.log(detail);})
                            .on('remove', function (detail) {console.log(detail);})
                            .on('issue', function (detail) {console.log(detail);});
                     return memcached;
                },
                destroy : function(client) {
                                    if(client.connected){
                                        try{
                                            client.end();
                                        }
                                        catch(err){
                                            console.log('Failed to memcached connection: ' + err);
                                        }
                                    }
                         }
            },
            {
                max : config.connectionLimit,
                idleTimeoutMillis : config.timeout,
                log : false
            }
            );
    }

    console.log("init pool for memcached end....");
};

MemcachedPool.prototype.set= function(key, val, expire, callback){
   
    pool.acquire().then(function(client){

        if(!expire) {expire = 172800;}else{expire=expire*1000}
        client.set(key, val, expire, function(err, data){
        	pool.release(client);
            if(err){
                callback(err, null);
                return;
            }
            callback(err, data);
        });
    }).catch(function(err){
        if(err){
            callback(err,null);
            return;
        }
    });
 
};

MemcachedPool.prototype.get = function(key, callback){

    pool.acquire().then(function(client){

        client.get(key, function(err, data){
        	pool.release(client);
            if(err){
                callback(err, null);
                return;
            }
            callback(err, data);
        });    
    }).catch(function(err){
        if(err){
            callback(err,null);
            return;
        }
    });
 
};

MemcachedPool.prototype.del = function(key, callback){
   
    pool.acquire().then(function(client){
        client.del(key, function(err, data){
        	pool.release(client);
            if(err){
                callback(err, null);
                return;
            }
            callback(err, data);
        });
    }).catch(function(err){
        if(err){
            callback(err);
            return;
        }
    });
 
};

module.exports = MemcachedPool;
