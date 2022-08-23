# -*- coding: utf-8 -*-
## 使用有问题请到github.com/ravelloh/RPageSearch提ISSUE
### Author: RavelloH
#### MICENCE: MIT
##### RPageSearch
import os
from bs4 import BeautifulSoup

## 设置目标
target = './articles/' # 目录位置
layers = 1 # 遍历层数
targettype = 'html' # 文件后缀名(只支持html)

## JSON标准格式
# {"articles":[{"title":"文章标题","path":"相对路径","time":"更新时间","text":"所有正文"},{"title":"文章标题","path":"相对路径","time":"更新时间","text":"所有正文"},{"title":"文章标题","path":"相对路径","time":"更新时间","text":"所有正文"}]}
main_structure_head='{"articles":['
main_structure_end=']}'
inner_structure_1='{"title":"'
inner_structure_2='","path":"'
inner_structure_3='","time":"'
inner_structure_4='","text":"'
inner_structure_5='"}'


## 打开目标目录
targetfile = []
for i in os.listdir(target):
    if '.' not in i:
        for k in os.listdir(target +i):
            if targettype in k:
                targetfile.append(target + i + '/' + k)

## 解析重构目标文件
inner_structure_cache=[]
inner_structure_text=''
for i in targetfile:
    with open(i,'r') as f:
        filecontent = BeautifulSoup(f.read(),'html.parser')
        textlist = filecontent.find_all(name='p')
        title = filecontent.find_all(name='h2')
        titlelen=len(title)
    length = len(textlist)
    for j in range(length):
        inner_structure_text=inner_structure_text+textlist[j].get_text()
    time = i[-19:-11]
    time = time[0:4]+'-'+time[4:6]+'-'+time[6:8]
    title = title[titlelen-1]
    path = i[1:][:-10]
    inner_structure_text=inner_structure_text.replace(' ','').replace('\n','').replace('"','&quot;')
    inner_structure_all = inner_structure_1 + str(title.get_text()) + inner_structure_2 + str(path) + inner_structure_3 + str(time) + inner_structure_4 + inner_structure_text + inner_structure_5
    inner_structure_cache.append(inner_structure_all)

## 重构完整JSON
main_structure = main_structure_head
for i in inner_structure_cache:
    main_structure = main_structure + i + ','
main_structure = main_structure[:-1] + main_structure_end

## 写入JSON至文件
with open(target+'search.json','w+') as f1:
    f1.write(main_structure)
    
        
