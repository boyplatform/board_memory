'use strict'
var conf=require("../../../src/config");
const memoryHttpHelper=require('../../../src/boyMemoryHttpHelper.js')
var memoryCommon=require('../../../src/boyMemoryCommon.js');
var MemoryNodeInfoRecord=require("../../../Dao/MemoryNodeInfoRecord");
var CrystalClusterBlock=require('../../../pojo/crystalClusterBlock');
var CrystalMasterVote=require('../../../pojo/crystalMasterVote');


function Interact(){
    
    if(this.memoryNodeInfoRecord===undefined){
        this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
     }
     if(this.crystalMasterVote===undefined){
        this.crystalMasterVote=new CrystalMasterVote();
     }
     
 
};

//seek current master node info
Interact.prototype.seekMasterNodeVoteResult=function(callback){
    
    if(this.memoryNodeInfoRecord===undefined){
        this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
     }
    this.memoryNodeInfoRecord.crystalClusterBlockSelect("1","where crstalNodeRole=0",[""],"",function(rows){

        callback(rows[0]);
    });
}

//Crystal cluster master timely self nature selection/vote result seek
Interact.prototype.timelyNodeSelectionVoteResultSeek=function(callback){

    if(this.memoryNodeInfoRecord===undefined){
        this.memoryNodeInfoRecord=new MemoryNodeInfoRecord();
     }
     
    //return back latest self nature selection vote result.
    this.memoryNodeInfoRecord.crystalMasterVoteSelect("1","",[""],"order by lastVoteCount desc",function(rows){
        callback(rows);
    });
    
};



module.exports=Interact;