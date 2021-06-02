//variables
var counter = 0;
document.getElementById("counter").innerHTML = counter;
var xcord;
var ycord;
const rows = 40;
const cols = 40;
let started=false; //btn startstop
let timer;// evolution timer
let evolutionSpeed=500; // evolution speed 0,5s
let genArr =[rows]; //2D arrays
let nextgenArr =[rows];
var fileinput = document.getElementById('file');

fileinput.addEventListener('change', function(e) {
	//resetWorld();
	var reader;
	var file = this.files[0];
	reader = new FileReader();
	reader.onload = function(evt){
		processFile(evt.target.result);
	};
	reader.readAsText(file); // image file to binary string
	
});
function processFile(data){
	var result;
	
	var lines = data.split('\n').filter(function(line){ 
    return line.indexOf( "#" ) == -1;
	});
	
	if (lines[0][0] == "." || lines[0][0] == "*"){ //raw file format
		//console.log(processRawFormat(lines));
		processRawFormat(lines);
	}
	
	function processRawFormat(lines)
	{
		xcord = document.getElementById('xcord').value;
		ycord = document.getElementById('ycord').value;
		//resetWorld();
		var result = [];
		
	
		for (var i = 0; i < lines.length; i++)
		{
			for (var j = 0; j < lines[i].length; j++)
			{
				if (lines[i][j] == "*"){
					if(xcord != null && xcord < rows-5 && ycord != null && ycord < cols-5){
					var number_xcord = Number(i) + Number(xcord);
					var number_ycord = Number(j) + Number(ycord);
					result.push([number_xcord,number_ycord]);
					cell = document.getElementById(number_xcord + '_' + number_ycord);
					cell.setAttribute('class', 'alive');
					genArr[number_xcord][number_ycord] = 1;
					}else{
					result.push([i,j]);
					cell = document.getElementById(i + '_' + j);
					cell.setAttribute('class', 'alive');
					genArr[i][j] = 1;
					}
				}
			}
		}
		for(var i=result.length-1;i>=0;i--)
		{
		if(result[i]=="")
		result.splice(i,result.length); //drop after 1. block
		}
		
		return result;
	}
	
};
function create_init_Arrays() {
	//create
    for (let i = 0; i < rows; i++) {
        genArr[i] = new Array(cols);
        nextgenArr[i] = new Array(cols);
    }
	//initialize, set all array locations to 0=dead
	for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            genArr[i][j] = 0;
            nextgenArr[i][j] = 0;
        }
    }
}
function createWorld() {
    let world = document.querySelector('#world_');
    
    let tbl = document.createElement('table');
    tbl.setAttribute('id','worldgrid');
for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('td');
			cell.setAttribute('id', i + '_' + j);
            cell.setAttribute('class', 'dead');
            cell.addEventListener('click',cellClick);
            tr.appendChild(cell);
        }
        tbl.appendChild(tr);
    }
    world.appendChild(tbl);
}
function cellClick() {
    let loc = this.id.split("_");
    let row = Number(loc[0]);//Get i
    let col = Number(loc[1]);//Get j
	//set cell alive or dead
    if (this.className==='alive'){
        this.setAttribute('class', 'dead');
		genArr[row][col] = 0;
       
    }else{
        this.setAttribute('class', 'alive');
		genArr[row][col] = 1;
       
    }
}
window.onload=()=>{
    createWorld();
	create_init_Arrays();
}
function NeighborCount(row, col) {
    let count = 0;
    let nrow=Number(row);
    let ncol=Number(col);

        //not first row -1 - 0
        if (nrow - 1 >= 0 && genArr[nrow - 1][ncol] == 1) {
			count++;
		}
        // not first row first cell -1 - -1 upper left
        if (nrow - 1 >= 0 && ncol - 1 >= 0 && genArr[nrow - 1][ncol - 1] == 1) {
            count++;
		}
        // not first row last column -1 - +1 upper right
        if (nrow - 1 >= 0 && ncol + 1 < cols && genArr[nrow - 1][ncol + 1] == 1) {
                count++;
        }
		//0 - -1 left
		if (ncol - 1 >= 0 && genArr[nrow][ncol - 1] == 1) {
            count++;
		}
		// 0 - +1 right
		if (ncol + 1 < cols && genArr[nrow][ncol + 1] == 1) {
            count++;
		}
		//+1 - -1 bottom left
		if (nrow + 1 < rows && ncol - 1 >= 0 && genArr[nrow + 1][ncol - 1] == 1) {
            count++;
		}
		//+1 - +1 bottom right
		if (nrow + 1 < rows && ncol + 1 < cols && genArr[nrow + 1][ncol + 1] == 1) {
            count++;
		}
        // +1 - 0 bottom
		if (nrow + 1 < rows && genArr[nrow + 1][ncol] == 1) {
            count++;
		}
    
    return count;
}
function createnextgenArr() {
    for (row in genArr) {
        for (col in genArr[row]) {
           
            let neighbors = NeighborCount(row, col);
            //rules
            //Alive
            if(genArr[row][col] == 1) {
                if (neighbors < 2) {
                    nextgenArr[row][col] = 0; //rule 1 - underpopulation
                } else if(neighbors == 2 || neighbors == 3) { //rule 2
                    nextgenArr[row][col] = 1;
                } else if(neighbors > 3) { //rule 3 overpopulation 
                    nextgenArr[row][col] = 0;
                }
            } else if(genArr[row][col] == 0){
                //Dead or Empty
				//rule 4 - become a live cell
                if (neighbors == 3) {
                    nextgenArr[row][col] = 1;
                }
            }
        }
    }
    
}
function updateGens() {
        for (row in genArr) {
            for (col in genArr[row]) {
                //update with the result
                genArr[row][col] = nextgenArr[row][col];
                nextgenArr[row][col] = 0;
            }
        }
     
    }
function updateWorld() {
        let cell='';
        for (row in genArr) {
            for (col in genArr[row]) {
                cell = document.getElementById(row + '_' + col);
                if (genArr[row][col] == 0) {
                    cell.setAttribute('class', 'dead');
                } else {
                    cell.setAttribute('class', 'alive');
                }
            }
        }
    }
function evolution(){
		counter++;
		document.getElementById("counter").innerHTML = counter;
        createnextgenArr();//rules
        updateGens();
        updateWorld();//world view update
		if(started){
            timer = setTimeout(evolution, evolutionSpeed);
        }
}
function startStopChanger(){
        let startstop=document.querySelector('#btnstartstop');
       
        if (!started) {
           started = true;
           startstop.value='Stop the evolution';
           evolution();
         
         } else {
            started = false;
            startstop.value='Start the evolution';
            clearTimeout(timer); 
        }
    }
function resetWorld() {
        location.reload();
		counter = 0;
    }


	

