//在1-range范围内生成1-n整数的数据
// whole true 连续的
//       num  去掉num个
function genRandom(n, range){
    var rdmArr = [];
    for(var i=0; i<n; i++){
        var rdm = Math.ceil(Math.random() * range, 10);
        if(!~rdmArr.indexOf(rdm)){
            rdmArr.push(rdm);
        }else{
            i--;
        }
    }
    return rdmArr;
}

//生成1-n整数的数组并且在里面随机去掉whole个整数
function setArr(n, whole){
    var arr = [];
    var rdmArr = genRandom(whole, n);
    for (var i = 1; i <= n; i++) {
        if (!whole || !rdmArr.filter(function(item,j){
            return item === i;
        }).length){
            arr.push(i)
        }
    };
    return arr;
}

//找出【1-n整数的数组并且在里面随机去掉whole个整数】，中去掉的那n个数;
// 1.根据位置定位
function findNumByPosition(arr, n){
    var j, targetArr = [], begin=1;
    for(var i=0; i<arr.length; i++){
        //如果找到则某个位置少数则继续对应这个位置的数;
        if(arr[i] !== begin){
            targetArr.push(begin);
            i--;
        }
        begin++;
    }
    return targetArr;
}

//冒泡排序
function bubbleArr(arr){
    var i = arr.length, j, temp;
    while(i){
        for(var j=0; j<i-1; j++){
            if(arr[j] > arr[j+1]){
                temp = arr[j+1];
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
            // console.log(arr, 'arrSub');
        };
        // console.log(arr, 'arr');
        i--;
    }
    return arr;
}


//快速排序
function quickSort(arr){
    if(arr.length<=1){
        return arr;     //递归结束条件
    }
    var pivotIndex = Math.floor(arr.length/2);
    var pivot = arr.splice(pivotIndex,1)[0];    //标准对比值,arr为去除对比值后的数据
    var left = [],right = [];
    for(var i=0; i<arr.length; i++){
        if(arr[i] < pivot){
            left.push(arr[i]);
        }else{
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));
}

//origin XMLHttpRequest;
function get(url, callback){
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onreadystatechange = function(){
        if(req.status === 4 && req.statusCode === '200'){
            var resType = req.getResponseHead('Content-Type');
            if(resType.indexOf('applicaton/json')){
                callback(JSON.parse(req.responseText));
            }else if(resType.index('text')){
                callback(req.responseText);
            }else{
                callback(req.responseText)
            }
            // req.responseText
        }
    };
    req.send(null);
}