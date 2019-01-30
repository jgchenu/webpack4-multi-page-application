module.exports = function(env, argv) {
    if(argv.mode==='development'){
        return require('./configs/webpack.development')
    }else if(argv.mode==='production'){
        return require('./configs/webpack.production');
    }else{
        //这个留作以后的test 配置，暂时还未完成
        return require('./configs/webpack.development'); 
    }
  }