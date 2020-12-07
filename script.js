var colorCodes = ["FF3C33", "33A2FF", "33FF52", "DA33FF","33F6FF","FF33A8","33FFCA","FFFC33","E9FF33","D4FF33"];
var algorithms =["fcfs","sjf","priority","robin"]
recalculateServiceTime();
$('.priority-only').hide();

$(document).ready(function () {
  $('#algorithm').change(function () {
    if (this.value == 'priority') {
      $('.priority-only').show();
      $('.servtime').show();
      $('#minus').css('left', '604px');
    }
    else {
      $('.priority-only').hide();
      $('.servtime').show();
      $('#minus').css('left', '428px');
    }

    if (this.value == 'robin') {
      $('.servtime').hide();
      $('#quantumParagraph').show();
    }
    else {
      $('#quantumParagraph').hide();
      $('.servtime').show();
    }
    showAlgorthimDescription();
    recalculateServiceTime();
  });
  showAlgorthimDescription();
  updateProcessColor();
});

function showAlgorthimDescription(){
  algorithms.forEach(function(index){
    $('#'+index).hide();
 });
 $('#'+getAlgorithm()).show();
}

function addRow() {
  var lastRow = $('#inputTable tr:last');
  var lastRowNumebr = parseInt(lastRow.children()[1].innerText);

  var newRow = '<tr><td class="process">P'
  + (lastRowNumebr + 1)
  + '</td><td>'
  + (lastRowNumebr + 1)
  + '</td><td><input class="exectime" type="text"/></td><td class="servtime"></td>'
  + '<td class="priority-only"><input type="text"/></td></tr>';

  lastRow.after(newRow);

  var minus = $('#minus');
  minus.show();
  minus.css('top', (parseFloat(minus.css('top')) + 24) + 'px');

  if (getAlgorithm() != "priority")
    $('.priority-only').hide();

    updateProcessColor();
  $('#inputTable tr:last input').change(function () {
    recalculateServiceTime();
  });
}

function deleteRow() {
  var lastRow = $('#inputTable tr:last');
  lastRow.remove();

  var minus = $('#minus');
  minus.css('top', (parseFloat(minus.css('top')) - 24) + 'px');

  if (parseFloat(minus.css('top')) < 150)
    minus.hide();
}

$(".initial").change(function () {
  recalculateServiceTime();
});

function recalculateServiceTime() {
  var inputTable = $('#inputTable tr');
  var totalExectuteTime = 0;

  var algorithm = getAlgorithm();
  if (algorithm == "fcfs") {
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      $(value.children[3]).text(totalExectuteTime);

      var executeTime = parseInt($(value.children[2]).children().first().val());
      totalExectuteTime += executeTime;
    });
  }
  else if (algorithm == "sjf") {
    var exectuteTimes = [];
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      exectuteTimes[key - 1] = parseInt($(value.children[2]).children().first().val());
    });

    var currentIndex = -1;
    for (var i = 0; i < exectuteTimes.length; i++) {
      currentIndex = findNextIndex(currentIndex, exectuteTimes);

      if (currentIndex == -1) return;

      $(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);

      totalExectuteTime += exectuteTimes[currentIndex];
    }
  }
  else if (algorithm == "priority") {
    var exectuteTimes = [];
    var priorities = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      exectuteTimes[key - 1] = parseInt($(value.children[2]).children().first().val());
      priorities[key - 1] = parseInt($(value.children[4]).children().first().val());
    });

    var currentIndex = -1;
    for (var i = 0; i < exectuteTimes.length; i++) {
      currentIndex = findNextIndexWithPriority(currentIndex, priorities);

      if (currentIndex == -1) return;

      $(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);

      totalExectuteTime += exectuteTimes[currentIndex];
    }
  }
  else if (algorithm == "robin") {
    $('#minus').css('left', '335px');
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      $(value.children[3]).text("");
    });
  }

}

function updateProcessColor(){
  $(".process").each(function( index ) {
    $(this).css("background-color",colorCodes[index%10]);
  });
}

function findNextIndexWithPriority(currentIndex, priorities) {
  var currentPriority = 1000000;
  if (currentIndex != -1) currentPriority = priorities[currentIndex];
  var resultPriority = 0;
  var resultIndex = -1;
  var samePriority = false;
  var areWeThereYet = false;

  $.each(priorities, function (key, value) {
    var changeInThisIteration = false;

    if (key == currentIndex) {
      areWeThereYet = true;
      return true;
    }
    if (value <= currentPriority && value >= resultPriority) {
      if (value == resultPriority) {
        if (currentPriority == value && !samePriority) {
          samePriority = true;
          changeInThisIteration = true;
          resultPriority = value;
          resultIndex = key;                            
        }                        
      }
      else if (value == currentPriority) {
        if (areWeThereYet) {
          samePriority = true;
          areWeThereYet = false;
          changeInThisIteration = true;
          resultPriority = value;
          resultIndex = key;
        }
      }
      else {
        resultPriority = value;
        resultIndex = key;
      }

      if (value > resultPriority && !changeInThisIteration)
        samePriority = false;
    }
  });
  return resultIndex;
}

function findNextIndex(currentIndex, array) {
  var currentTime = 0;
  if (currentIndex != -1) currentTime = array[currentIndex];            
  var resultTime = 1000000;
  var resultIndex = -1;
  var sameTime = false;
  var areWeThereYet = false;

  $.each(array, function (key, value) {
    var changeInThisIteration = false;

    if (key == currentIndex) {
      areWeThereYet = true;
      return true;
    }
    if (value >= currentTime && value <= resultTime) {
      if (value == resultTime) {                        
        if (currentTime == value && !sameTime) {
          sameTime = true;
          changeInThisIteration = true;
          resultTime = value;
          resultIndex = key;                            
        }                        
      }
      else if (value == currentTime) {
        if (areWeThereYet) {
          sameTime = true;
          areWeThereYet = false;
          changeInThisIteration = true;
          resultTime = value;
          resultIndex = key;
        }
      }
      else {
        resultTime = value;
        resultIndex = key;
      }

      if (value < resultTime && !changeInThisIteration)
        sameTime = false;
    }
  });
  return resultIndex;
}

function animate() {
	$('fresh').prepend('<div id="curtain" style="position: absolute; right: 0; width:100%; height:100px;"></div>');
  
  $('#curtain').width($('#resultTable').width());
  $('#curtain').css({left: $('#resultTable').position().left});
  
  var sum = 0;
  $('.exectime').each(function() {
      sum += Number($(this).val());
  });
  
  console.log($('#resultTable').width());
  var distance = $("#curtain").css("width");
  
  animationStep(sum, 0);
  jQuery('#curtain').animate({ width: '0', marginLeft: distance}, sum*1000/2, 'linear');
}

function animationStep(steps, cur) {
	$('#timer').html(cur);
	if(cur < steps) {
		setTimeout(function(){ 
   	     animationStep(steps, cur + 1);
  	}, 500);
  }
  else {
  }
}

function getAlgorithm(){
  return $('#algorithm').val();
}

function draw() {
  $('fresh').html('');
  var inputTable = $('#inputTable tr');
  var th = '';
  var td = '';

  var algorithm = getAlgorithm();
  if (algorithm == "fcfs") {
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var color= colorCodes[(key - 1)%10];
      var executeTime = parseInt($(value.children[2]).children().first().val());
      if(executeTime>0){
        th += '<th style="height: 60px; width: ' + executeTime * 20 + 'px; background-color:'+color+'">P' + (key - 1) + '</th>';
        td += '<td>' + executeTime + '</td>';
      }
    });

    $('fresh').html('<table id="resultTable"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  else if (algorithm == "sjf") {
    var executeTimes = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[2]).children().first().val());
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1 };
    });

    executeTimes.sort(function (a, b) {
      if (a.executeTime == b.executeTime)
        return a.P - b.P;
      return a.executeTime - b.executeTime
    });

    $.each(executeTimes, function (key, value) {
      var color= colorCodes[(value.P)%10];
      if(value.executeTime>0){
        th += '<th style="height: 60px; width: ' + value.executeTime * 20 + 'px;background-color:'+color+'">P' + value.P + '</th>';
        td += '<td>' + value.executeTime + '</td>';
      }
    });

    $('fresh').html('<table id="resultTable"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  else if (algorithm == "priority") {
    var executeTimes = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[2]).children().first().val());
      var priority = parseInt($(value.children[4]).children().first().val());
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1, "priority": priority };
    });

    executeTimes.sort(function (a, b) {
      if (a.priority == b.priority)
        return a.P - b.P;
      return b.priority - a.priority
    });

    $.each(executeTimes, function (key, value) {
      var color= colorCodes[(value.P)%10];
      if(value.executeTime>0){
        th += '<th style="height: 60px; width: ' + value.executeTime * 20 + 'px;background-color:'+color+'">P' + value.P + '</th>';
        td += '<td>' + value.executeTime + '</td>';
      }
    });

    $('fresh').html('<table id="resultTable" style="width: 70%"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  else if (algorithm == "robin") {
    var quantum = $('#quantum').val();
    var executeTimes = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[2]).children().first().val());
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1 };
    });

    var areWeThereYet = false;
    while (!areWeThereYet) {
      areWeThereYet = true;
      $.each(executeTimes, function (key, value) {
        if (value.executeTime > 0) {
          var color= colorCodes[(value.P)%10];
          th += '<th style="height: 60px; width: ' + (value.executeTime > quantum ? quantum : value.executeTime) * 20 + 'px;background-color:'+color+'">P' + value.P + '</th>';
          td += '<td>' + (value.executeTime > quantum ? quantum : value.executeTime) + '</td>';
          value.executeTime -= quantum;
          areWeThereYet = false;
        }
      });
    }
    $('fresh').html('<table id="resultTable" style="width: 70%"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  animate();
}