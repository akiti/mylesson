/* Section 1: Covering the Foundations
	Cache your scripts:
		- Use consistent URLs
		- set ETAGS and Expire rules
		- CDN 
*/


function onReady(){
	console.log('JavaScript High Performance');

	window.startClocks();

	var fun = new Function("copy", "console.log(copy, return 'he said' + copy;)");
	 //eval("fun = function(copy){console.log(copy);return 'he said:' + copy;}");

	console.log(fun("I talk to you"));
    
}

function startClocks(){
  var o2geek = com.o2GEEK,
  		clock = new o2geek.AlarmClock('clock'),
		clock2 = new o2geek.TextClock('clock2',-300,'ETC'),
		clock2 = new o2geek.Clock('clock3',300,'X');

}

function LiveDate(a,b,c){
	console.log(this, a,b,c);
}

Date.__interval = 0;
Date.__aDates = [];
Date.addToInterval=function (date){
	//console.log(this.__interval);
	this.__aDates.push(date);

	if(!this.__interval)
		this.__interval = setInterval(function(){Date.updateDates()},1000);
}
Date.updateDates= function(){
	// var scope = this;
    var prop = '__aDates';
    // var aDates = eval('scope.' + prop);
	var aDates = this[prop],
		dt, i;
	for(i=0; i<aDates.length;i++){
		dt = aDates[i];
		if(dt instanceof Date)
			dt.updateSeconds();
		else if(dt instanceof Function)
			dt(); 
		else if(dt && dt['update'])
			dt.update();
	}
}


Date.prototype.updateSeconds = function(){
	this.setSeconds(this.getSeconds()+1);
	//console.log(Date.__interval);
}

Date.prototype.autoClock = function(isAuto){
	//clearInterval(this.clockInterval);

	if(isAuto){
		/*var that= this;
		this.clockInterval = setInterval(function(){that.updateSeconds()},1000);*/
		Date.addToInterval(this);
	}
}
var com = com || {};
	com.o2GEEK = com.o2GEEK || {};


com.o2GEEK.Clock = function (id,offset,label){
		offset = offset || 0;
		label = label || '';
		var d = new Date(),
			offset = (offset+ d.getTimezoneOffset())*60*1000;
		this.d = new Date(offset+d.getTime());
		this.d.autoClock(true);
		this.id = id;
		this.label= label;
		 

	this.tick(true);
	var that = this;
	Date.addToInterval(function(){
		that.updateClock();});
	
};
com.o2GEEK.Clock.prototype.version = '1.00';
com.o2GEEK.Clock.prototype.tick=function(isTick){
	//clearInterval(this.myInternalInterval);
	this.isTicking = isTick;
	/*if(isTick){
		var that = this;
		this.myInternalInterval = setInterval(function(){
		that.updateClock();},1000);
		this.updateClock();
	}*/
}

com.o2GEEK.Clock.prototype.updateClock = function(){
			if(this.isTicking){
				var date = this.d,
					//date.updateSeconds();
					clock = document.getElementById(this.id);
				clock.innerHTML = this.formatOutput(date.getHours(),date.getMinutes(),date.getSeconds(),this.label) ;
			}
		};

com.o2GEEK.Clock.prototype.formatOutput = function(h,m,s,label){
	return this.formatDigits(h) + ":" + this.formatDigits(m) + 
				":" + this.formatDigits(s) + " " + label;
}


com.o2GEEK.Clock.prototype.formatDigits= function(val){
	if(val<10) val = "0" + val;

	return val;
};

com.o2GEEK.TextClock = function(id,offset,label){
	com.o2GEEK.Clock.apply(this,arguments);
	console.log(this.version);

	this.formatOutput = function(h,m,s,label){
		return this.formatDigits(h) + " Hour " + this.formatDigits(m) +" Minutes "+ this.formatDigits(s) +" Seconds "+ label;
	}
}
com.o2GEEK.TextClock.prototype = createObject(com.o2GEEK.Clock.prototype,com.o2GEEK.TextClock);
//com.o2GEEK.TextClock.prototype.constructor = com.o2GEEK.TextClock;
//com.o2GEEK.TextClock.prototype.version = '1.01';

com.o2GEEK.AlarmClock = function(id,offset,label){
	com.o2GEEK.Clock.apply(this,arguments);
	
	console.log(this.version);

	this.doUpdate = true;
	var dom = this.dom = document.getElementById(id),
		that = this;
	dom.contentEditable = true;
	dom.addEventListener('focus',function(e){
		this.innerHTML = this.innerHTML.slice(0,this.innerHTML.lastIndexOf(':'));
		that.tick(false);
	});
	dom.addEventListener('blur',function(e){
		var a = this.innerHTML.split(':'),
			almh = that.almH = parseInt(a[0]),
			almM = almM = parseInt(a[1]),
			event;
		if((almH>=0 && that.almH<24) &&
			(almM>=0 && that.almM<60)	 ){
			event = new Event('restart_tick');
			this.dispatchEvent(event);
		}

		console.log(almH,almM);
		
	});

	dom.addEventListener('restart_tick',function(){
		that.tick(true);
	})
	
}

com.o2GEEK.AlarmClock.prototype = createObject(com.o2GEEK.Clock.prototype,com.o2GEEK.AlarmClock);


com.o2GEEK.AlarmClock.prototype.formatOutput= function(h,m,s,label){
	var output, 
		snd;
	if(h===this.almH && m===this.almM){
		output= 'ALARM WAKE UP';
		snd = new Audio('art/beep.mp3');
		snd.play();
	}else
		output= com.o2GEEK.Clock.prototype.formatOutput.apply(this,arguments);

	return output;
}






function createObject(proto,cons){
	function c(){}
	c.prototype = proto;
	c.prototype.constructor = cons;
	return new c();
}

window.onload = onReady;

//follow me at https://twitter.com/02geek
//learn more about me at http://02geek.com