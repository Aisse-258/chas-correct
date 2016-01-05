var fs = require('fs');
var parser = require('./parse-lib.js');
var Worker = require('webworker-threads').Worker;

var globalExpression=parser.makeGlobalExpression();
var actionArray=parser.readActionArray();
var length;

var errors;
var pagesProceeded;
var pagesWithErrors;

var name="log";
var log404="";

var textBuffer="";
var wordcounter;

function countErrorsInURLarray(urls,maxlength,beginFrom,endWith,options){
	errors=0;
	pagesProceeded=0;
	pagesWithErrors=0;
	parser.makeWordsEmpty();
	length=Math.min(maxlength,urls.length);
	if(options && options.name){
		name=options.name;
	}
	console.log("Обрабатывается страниц: "+length);
	for(var i=0; i<length; i++){
		var newopts={};
		for(var prop in options)
			newopts[prop]=options[prop];
		newopts.url=urls[i];
		parser.getChunkFromURL(urls[i],workWithChunk,beginFrom,endWith,newopts);
	}

	wordcounter=new Worker(wordcountWorker);
	wordcounter.onmessage=function(m){console.log(m.data)};
/*	worker = new Worker(ali);
	worker.onmessage = function(m) {
	  console.log(m.data);
	};*/
}

function countErrorsInURLlist(filename,maxlength,beginFrom,endWith,options){
	var urls=parser.readJSONfromFile(filename);
	name=filename.replace(".urllist.json","").replace("urllists/",""); //Костыль, ну да ладно
	countErrorsInURLarray(urls,maxlength,beginFrom,endWith,options);
}

function normalize(text){
	return text.replace(/ё/gi,"е").replace(/\s+/gi," ");
}

function workWithChunk(text,options){
	pagesProceeded++;
	if(pagesProceeded==length){
		finishCheck();
		return;
	}
	text=text.replace(/[^а-яё]{4,}/gi,";");
	if(!text.length){
		log404+=(options.url+" : целевой текст не выделен\n");
		pagesWithErrors++;
		return;
	}
	
	wordcounter.postMessage({
		type: 'newtext',
		text: text,
		parser: parser,
	});
/*	
	if(textBuffer.length>32*1024*1024){
		console.error('Сброс слов');
		parser.addTextToWords(textBuffer);
		textBuffer=text;
	}
	textBuffer+=';'+text;
*/	
	var possibleMistakes=text.match(globalExpression);
	if(!possibleMistakes){
		return;
	}

	for(var i=0; i<possibleMistakes.length; i++){
		var buf=possibleMistakes[i];
		for(var j=0; j<actionArray.length; j++){
			buf=buf.replace(actionArray[j][0],actionArray[j][1]);
		}
		if(normalize(buf) != normalize(possibleMistakes[i])){
			console.log(options.url+" : "+possibleMistakes[i]);
			errors++;
		}
	}
}

var worker;

function finishCheck(){
	var successPages=pagesProceeded-pagesWithErrors;
	console.log("Страниц обработано успешно: "+successPages);
	console.log("Страниц обработано неуспешно: "+pagesWithErrors);
	console.log("Ошибок обнаружено: "+errors);
	console.log("Ошибок обнаружено на страницу: "+(errors/successPages));
	fs.writeFileSync("results/"+name+".404.log",log404);
//	ali.f=function(a){return a+1;}
//	worker.postMessage({type:'ali',f:new String(function(a){return a+1;})});

/*	wordcounter.onmessage = function(m) {
	  console.log(m.data);
	};
*/
	wordcounter.onmessage=function(m){
		parser.setWords(m.data);
		console.log("Словоупотреблений обработано: "+ m.data.wordsCount);
		console.log("Ошибок на 1000 словоупотреблений обнаружено: "+(errors/m.data.wordsCount*1000))
		parser.resultToJSON('results/'+name+'.words');
		console.error("Завершено: "+name);
	}	
	
	wordcounter.postMessage({
		type: 'finish',
	});

	
	
/*	parser.addTextToWords(textBuffer);
	var wordsCount=parser.countWords();
	console.log("Словоупотреблений обработано: "+ wordsCount);
	console.log("Ошибок на 1000 словоупотреблений обнаружено: "+(errors/wordsCount*1000))
	parser.resultToJSON('results/'+name+'.words');
	console.error("Завершено: "+name);
*/
}


function extractURLlistFromURLsequence(o){
	var linksObject={};
	var pagesCount=o.pagesCount||5000;
	var pagesParsed=0;
	
	for(var i=0; i<pagesCount; i++){
		parser.getHTMLfromURL(o.prefix+i+(o.postfix||""),getUrls,i);
	}
	
	var linkRegExp=new RegExp('<a href="'+o.linkpattern+'[^"#]+',"g"); 
	function getUrls(html,i){
		var urlsOnPage=(''+html).match(linkRegExp);
		if(urlsOnPage){
			for(var j=0; j<urlsOnPage.length; j++){
				linksObject[urlsOnPage[j].replace('<a href="',o.linkprefix)]=0;
			}
		}
		pagesParsed++;
		if(pagesParsed==pagesCount){
			fs.writeFileSync("urllists/"+o.name+".urllist.json",JSON.stringify(Object.keys(linksObject)));
		} else if(!(i%20)){
			console.log(i);
		}
	}

}
/*
function ali(){
	this.textBuffer="";
	postMessage("I'm working before postMessage('ali').");
	this.onmessage = function(event) {
		var m=event.data;
		if(m.type=='ali'){
			//var f='';//new Function(m.f);
			postMessage('Hi ' + event.data.type + ' ' +f(1));
			self.close();
		}
	};
	this.f=f;
}
*/
function wordcountWorker(){
	this.textBuffer="";
	this.words={};
	this.wordsCount=0;
	this.wordm=/[^А-Яа-яЁё\-]/gm;
	this.regCyr=/[А-Яа-яЁё]/;
	this.addText=function(text){//TODO: найти способ избежать повторений с parse-lib
		var localWords=text.split(wordm);
		for(var i1=0; i1 < localWords.length; i1++){
			if(regCyr.test(localWords[i1]) && localWords[i1].length > 1){
				localWords[i1]=localWords[i1].toLowerCase();
				wordsCount++;
				if(words[localWords[i1]]){
					words[localWords[i1]]++;
				}else{
					words[localWords[i1]]=1;
				}
			}
		}
	}
	this.onmessage=function(message){
		var m=message.data;
		if(m.type=='newtext'){
			if(textBuffer.length>32*1024*1024){
				addText(textBuffer);
				textBuffer=m.text;
			}
			textBuffer+=';'+m.text;
		}else if(m.type=='countWords'){
			postMessage(wordsCount);	
		}else if(m.type=='getWords'){
			postMessage(words);	
		}else if(m.type=='finish'){
			addText(textBuffer);
			postMessage({
				words:words,
				wordsCount:wordsCount,
			});
			self.close();
		}
	}
}


module.exports.extractURLlistFromURLsequence = extractURLlistFromURLsequence;

module.exports.countErrorsInURLlist  = countErrorsInURLlist ;
module.exports.countErrorsInURLarray = countErrorsInURLarray;
