# Node code quality test  
this is a node code quality test project from upchina-live-node.
* unit test  
* code coverage
* reports for sonar

## install  
```  
  npm install 
```

## build 
```  
  npm build
```  

## report
the build reports in ./report folder.    

## CI Server  
* Sonar Server  
http://172.16.8.197:9000/
* Jenkins Server  
http://172.16.8.199:8080/

## git hooks  
### commit-msg     
please use：  
* feat：新功能（feature）
* fix：修补bug
* docs：文档（documentation）
* style： 格式（不影响代码运行的变动）
* refactor：重构（即不是新增功能，也不是修改bug的代码变动）
* test：增加测试
* chore：构建过程或辅助工具的变动  
* revert: 用于撤销以前的 commit  
  
### pre-commit   
add unit test check  
```   
  // gulpfile.js  
  ....
  // edit 'global' for coverage percent
  istanbul.enforceThresholds({ thresholds: { global: XXX } }
```  

> force commit pass test-hook:  
you can still force a commit by telling git to skip the pre-commit hooks by simply committing using --no-verify.    
e.g.   
`git.exe commit --cleanup=whitespace --no-verify`
