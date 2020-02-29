'use strict'
var validator=require('validator');
var memoryCommon=require('../src/boyMemoryCommon.js');
var QueueValidator=(function(){
    
    
    
    
    return function() {
         
        this.InputValidator=function(body,router){
            
            let validatorResult=[];
            switch(router)
            {
              case '/memData':
                //结构验证
                if(body.messageAction===undefined)
                {
                    validatorResult.push({RequestResponseId:memoryCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                }else{
                    if(body.messageAction!="write"&&body.messageAction!="read")
                    {
                        validatorResult.push({RequestResponseId:memoryCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                    }
                    else if(body.messageAction==="write"&&(body.targetDbName===undefined||body.writeSql===undefined||body.writeSqlParameter===undefined))
                    {
                        validatorResult.push({RequestResponseId:memoryCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                    
                    }else if(body.messageAction==="read"&&(body.targetDbName===undefined||body.keyObjName===undefined||body.keyObjType===undefined||body.cacheGenMethod===undefined||body.ttl===undefined||body.querySql===undefined||body.querySqlParameter===undefined)){
                        
                        validatorResult.push({RequestResponseId:memoryCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                    
                    }else{
                        validatorResult.push({Result:true});
                    }
                }
                break;
              case '/readMe':
                //结构验证
                if(body.type===undefined)
                {
                    validatorResult.push({RequestResponseId:memoryCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                }else{
                    validatorResult.push({Result:true});
                }
                break;

            }

            return validatorResult[0];
        }


    
    }
})();

module.exports=QueueValidator;