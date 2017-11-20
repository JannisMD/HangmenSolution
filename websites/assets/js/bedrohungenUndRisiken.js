

'use strict';
var BpmnViewer = window.BpmnJS;
var viewer = new BpmnViewer({ container: '#canvas'});

var xhr = new XMLHttpRequest();
var dieXml;
xhr.onreadystatechange = function(){
  if(xhr.readyState === 4){
    viewer.importXML(xhr.response, function(err){
      dieXml = xhr.response;
      console.log(dieXml);
      if(!err){
        console.log('Erfolg!');
        viewer.get('canvas').zoom('fit-viewport');
      }else{
        console.log('Fehler', err)
      }
    });
  }
};

xhr.open('GET','/diagram.bpmn', true);
xhr.send(null);

//Variable definieren um die Dreiecke zu setzen
var dreieckSetzen;

function getLayers(){


  //HIER WIRD DIE XML AUSGEWERTET UND GESCHAUT WELCHE TASK HABE ICH & FÜR WELCHE BRAUCHE ICH EIN DREIECK
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //DA WIR LEIDER DIE XML ALS STRING ABGESPEICHERT HABEN BRAUCHE ICH EINEN PARSER
    var parser = new DOMParser();
    var xmlDocument = parser.parseFromString(fertigeXmlDatei,"text/xml");
    var tagElements = xmlDocument.getElementsByTagName('task');
    console.log(tagElements);

    //JETZT AUF DIE TASK ZUGREIFEN UND NAMEN AUSLESEN
    var i;
    var tasks = [];
    for(i = 0; i < tagElements.length; i++){
      var taskName;
      taskName = tagElements[i].getAttribute('name');
      tasks[i] = taskName;
      taskName = '';
    }
    console.log(tasks);

    //SCHLÜSSELWORTER VON SERVER HOLEN UND IN DIEKEYWORDS SPEICHERN
    var xhr = new XMLHttpRequest();
    var dieKeyWords;
    var valueDesKeywords = [];
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){

        dieKeyWords = JSON.parse(xhr.response);
      //  console.log(dieKeyWords);
        //Jezt die Beschreibung aus dieKeyWords holen und den Wert in variable SPEICHERN
        //sollten mehrere später da sein mit For schleife durch das array itterieren **TO DOOO*
      //  console.log(dieKeyWords);
        valueDesKeywords = dieKeyWords;


            //JETZT MÜSSEN DIE SCHLÜSSELWÖRTER IN valueDesKeywords MIT DEN tasks VERGLICHEN WERDEN UND GESCHAUT WERDEN OB EINE BEDROHUNG Besteht
            //tasks
            //valueDesKeywords
            var j;
            var k;
            for(j = 0; j < tasks.length; j++){
              for(k = 0; k < valueDesKeywords.length; k++){
                if(tasks[j] == valueDesKeywords[k].Keywörter){
                  console.log(tasks[j]);
                  //Jetzt ID von dieser Stelle HOLEN
                  var idDerTask;
                  idDerTask = tagElements[j].getAttribute('id');

                  dreieckSetzen = idDerTask;
                  console.log(dreieckSetzen);
                  //HIER JETZT DAS ERSTELLEN DES LAYERS /////////////////////////////////////////////////////////////////////////////////////////
                  var overlays = viewer.get('overlays');
                  var overlayHtml = $('<div><img src="images/ElectricDangerKlein.png" alt="" id= /></div>');
                  // attach the overlayHtml to a node
                  overlays.add(dreieckSetzen, {
                    position: {
                      bottom: 25,
                      right: 25,
                    },
                    html: overlayHtml

                  });


                  //um zu wissen welche stelle wir gerade sind definieren wir eine variable die anzeigt welche Stelle
                  var welcheStelle = k;
                  //Hier werden die variablen gesetzt und mit den Datenbankeinträgen befüllt
                  var bedrohungen = [];
                  var bedrohungenBeschreibung = [];
                  var risiken = [];
                  var risikenBeschreibung = [];
                  var maßnahmen = [];
                  var akteure = [];
                  bedrohungen.push(dieKeyWords[welcheStelle].Bedrohungen);
                  bedrohungenBeschreibung.push(dieKeyWords[welcheStelle].Bedrohung_beschreibung);
                  risiken.push(dieKeyWords[welcheStelle].Risiken);
                  risikenBeschreibung.push(dieKeyWords[welcheStelle].Risiken_beschreibung);
                  maßnahmen.push(dieKeyWords[welcheStelle].Maßnahmen);
                  akteure.push(dieKeyWords[welcheStelle].Akteure);

                  console.log(welcheStelle);
                  console.log(bedrohungen);
                  console.log(bedrohungenBeschreibung);
                  console.log(risiken);
                  console.log(risikenBeschreibung);
                  console.log(maßnahmen);
                  console.log(akteure);
                  var index = 0;




                  // Hier werden die ganzen Informationen als Pop-up Fesnter angezeigt
                  /*alert('Arbeitsschritt:'+' ' + tagElements[j].getAttribute('name') + '\n' +
                        'Bedrohungen:'+' '+ bedrohungen+ '\n' +
                        'Beschreibung:'+' '+ bedrohungenBeschreibung + '\n' +
                        'Risiken:'+' '+ risiken + '\n' +
                        'Beschreibung:'+' '+ risikenBeschreibung + '\n' +
                        'Maßnahmen:'+' '+ maßnahmen + '\n' +
                        'Akteure:'+' '+ akteure);*/




                  /*overlayHtml.click(function(e) {


                    //MUSS NOCH SCHÖNER GEMACHT WERDEN
                    //alert('Bedrohung: ' + bedrohungen + '\n' +'Beschreibung der Bedrohung: ' + bedrohungenBeschreibung + '\n' + 'Risiken: '+ risiken + '\n' + 'Beschreibung der Risiken: ' + risikenBeschreibung + '\n' + 'Maßnahmen: ' + maßnahmen + '\n' + 'Akteure: ' + akteure + '\n');
                    alert('Bedrohung: ' + bedrohungen + '\n' +'Beschreibung der Bedrohung: ' + bedrohungenBeschreibung + '\n' + 'Risiken: '+ risiken + '\n' + 'Beschreibung der Risiken: ' + risikenBeschreibung + '\n' + 'Maßnahmen: ' + maßnahmen + '\n' + 'Akteure: ' + akteure + '\n');
                    //Zur überprüfung consolen logs


                  });*/

                  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  //dreieckSetzen variable wieder löschen damit sie beim nächsten durchlauf Leer ist
                  dreieckSetzen = '';
                }else{
                  console.log('Keine Übereinstimmung');
                }
              }
            }

      }
    };
    xhr.open('GET','/getKeyWords', true);
    xhr.send(null);

}
//HIER WIRD NACH DEM MODDELLIEREN DES BENUTZERS DIE FERTIGE XML DATEI GESPEICHERT
//Die Datei mit dem aktuellen Diagramm
var fertigeXmlDatei;
///////////////////////////////////////
function saveXML(){
  viewer.moddle.toXML(viewer.definitions, {format: true},function (err,updatedXML){
    fertigeXmlDatei = updatedXML;
    console.log(fertigeXmlDatei);

  });
}


// Arbeitsabläufe können durch Button geöffnet werden
$(document).ready(function(){
  $("#show").click(function(){
      $("#canvas").toggle(1000);
  });
  });

// SweetAlert...Bedrohungen werden angezeigt (alternative für alert)
