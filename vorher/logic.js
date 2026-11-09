(function(root) {
  'use strict';
  const questions = [
    {id:'role', title:'Was beschreibt deinen Beruf am besten?', hint:'Dein Alltag ist der Ausgangspunkt.', options:[['fachkraft','Pflegefachkraft'],['assistenz','Pflegehilfe oder Pflegeassistenz'],['ausbildung','In Ausbildung oder Studium'],['gesundheit','Anderer Gesundheitsberuf']]},
    {id:'employer', title:'In welchem Umfeld arbeitest du?', hint:'Leistungen können sich je nach Arbeitgeber unterscheiden.', options:[['oeffentlich','Öffentlicher Träger · zum Beispiel kommunale Klinik'],['kirchlich','Kirchlicher Träger · zum Beispiel Caritas oder Diakonie'],['privat','Privater Träger · Klinik, Heim oder Pflegedienst'],['unklar','Weiß ich gerade nicht']]},
    {id:'stage', title:'Was steht gerade bei dir an?', hint:'Du musst keine Beträge oder persönlichen Details nennen.', options:[['start','Berufsstart · die ersten eigenen Finanzentscheidungen'],['alltag','Mitten im Beruf · mehr Ordnung und Überblick'],['veraenderung','Veränderung · neue Stelle, Teilzeit oder Familienzeit'],['zukunft','Langfristig planen · mit Blick auf die Zeit nach dem Beruf']]},
    {id:'topic', title:'Welches Thema möchtest du zuerst verstehen?', hint:'Entscheide nach deinem Gefühl. Du legst dich auf nichts fest.', options:[['leistungen','Arbeitgeberleistungen und mögliche Zuschüsse'],['schutz','Mein Einkommen und meine Absicherung'],['aufbau','Rücklagen, Vermögensaufbau und Vorsorge'],['ueberblick','Erst einmal einen Gesamtüberblick bekommen']]},
    {id:'priority', title:'Was würde dir jetzt am meisten helfen?', hint:'So wird aus deinen Antworten ein sinnvoller nächster Schritt.', options:[['selbst','Eine Liste, mit der ich selbst anfangen kann'],['erklaerung','Verständliche Erklärungen zu meinen Fragen'],['plan','Ein Gespräch über meinen persönlichen Plan'],['zeit','Ein kleiner erster Schritt, der wenig Zeit braucht']]}
  ];
  const topicPlans = {
    leistungen:{title:'Arbeitgeberleistungen sichtbar machen',body:'Schau in deine aktuelle Abrechnung und deinen Arbeits- oder Tarifvertrag: Welche Leistungen sind bereits enthalten, welche Fragen sind offen?'},
    schutz:{title:'Vorhandenen Schutz verstehen',body:'Sammle deine Versicherungsübersichten. Welche Risiken sind abgesichert, welche Leistungen gelten und welche Beiträge zahlst du? Erst verstehen, dann über Änderungen nachdenken.'},
    aufbau:{title:'Deine Ziele in eine Reihenfolge bringen',body:'Notiere kurzfristige Wünsche, finanzielle Reserven und langfristige Ziele getrennt. So lassen sich Zeiträume und Prioritäten besser besprechen.'},
    ueberblick:{title:'Eine Seite für deine Finanzen anlegen',body:'Eine einfache Liste mit regelmäßigen Einnahmen, Ausgaben, Rücklagen und bestehenden Verträgen schafft den Ausgangspunkt. Genaue Beträge gehören erst in deine private Übersicht.'}
  };
  function validAnswers(answers){return questions.every(q=>q.options.some(([value])=>answers[q.id]===value));}
  function buildPlan(answers){
    if(!validAnswers(answers)) throw new Error('Bitte beantworte alle fünf Fragen.');
    const items = [{...topicPlans[answers.topic]}];
    if(answers.employer==='oeffentlich'||answers.employer==='kirchlich') items.push({title:'Zusatzversorgung mit auf die Liste nehmen',body:'Bei deinem Arbeitgeber können tarifliche oder betriebliche Vorsorgeleistungen bestehen. Halte die jährliche Übersicht bereit und kläre, was tatsächlich für dich eingezahlt wird.'});
    else if(answers.employer==='privat') items.push({title:'Beim Arbeitgeber konkret nachfragen',body:'Bitte deine Personalstelle um eine Übersicht zu vermögenswirksamen Leistungen, betrieblicher Vorsorge und möglichen Zuschüssen. Ob etwas angeboten wird, ist individuell zu klären.'});
    else items.push({title:'Deinen Arbeitgeberrahmen klären',body:'Der Name des Trägers und ein Blick in deinen Arbeitsvertrag helfen weiter. Frage bei deiner Personalstelle nach Tarifbindung, Arbeitgeberleistungen und betrieblicher Vorsorge.'});
    const stagePlans = {
      start:{title:'Mit den Grundlagen starten',body:'Lege wichtige Unterlagen an einem Ort ab und trenne monatliche Verpflichtungen von deinen eigenen Sparzielen. Eine überschaubare Liste genügt für den Anfang.'},
      alltag:{title:'Bestehendes einmal in Ruhe sortieren',body:'Notiere, was du bereits geregelt hast und was du nicht erklären könntest. Diese offenen Fragen sind eine gute Grundlage für dein nächstes Gespräch.'},
      veraenderung:{title:'Veränderungen in deinen Plan aufnehmen',body:'Notiere, was sich bei Arbeitszeit, Arbeitgeber oder familiärer Situation verändert. Prüfe mit Unterstützung, welche bestehenden Leistungen und Verträge davon betroffen sein können.'},
      zukunft:{title:'Deine Vorsorgeübersicht zusammenstellen',body:'Lege Renteninformation und vorhandene betriebliche oder private Vorsorgeübersichten nebeneinander. Trenne garantierte Werte von Hochrechnungen und notiere offene Fragen.'}
    };
    const third={...stagePlans[answers.stage]};
    if(answers.role==='ausbildung'&&answers.stage!=='start'){third.body+=' Als Auszubildende oder Auszubildender kannst du zusätzlich nach den für dich geltenden Arbeitgeberleistungen fragen.';}
    if(answers.role==='assistenz'){third.body+=' Entscheidend sind dabei deine tatsächliche Tätigkeit und deine Vertragsbedingungen.';}
    if(answers.role==='gesundheit'){third.body+=' Dein konkreter Gesundheitsberuf und dein Beschäftigungsmodell bilden dafür den Rahmen.';}
    items.push(third);
    const intros={selbst:'Hier ist deine Startliste. Du kannst sie herunterladen und in deinem Tempo durchgehen.',erklaerung:'Diese drei Themen geben deinen Fragen eine Struktur. Du musst die Antworten noch nicht kennen.',plan:'Diese drei Themen kannst du in ein Kennenlernen mitnehmen. Du bestimmst, womit ihr startet.',zeit:'Ein kleiner Anfang reicht: Nimm dir zuerst den ersten Punkt vor. Die anderen können warten.'};
    return {title:answers.priority==='zeit'?'Dein kleiner erster Schritt.':'Dein nächster guter Schritt.',intro:intros[answers.priority],items,answers:{...answers}};
  }
  function labelFor(id,value){const q=questions.find(q=>q.id===id);return q?.options.find(o=>o[0]===value)?.[1]||'';}
  function planText(plan){return ['FINANZCARE – DEIN FINANZ-KOMPASS','Verstehen. Planen. Vorsorgen.','',plan.intro,'',...plan.items.flatMap((item,i)=>[`${i+1}. ${item.title}`,item.body,'']),'DEINE AUSWAHL',...questions.map(q=>`${q.title}\n${labelFor(q.id,plan.answers[q.id])}`),'','Allgemeine Orientierung, keine individuelle Finanz-, Steuer- oder Rechtsberatung. Es werden keine Förderansprüche oder Produktempfehlungen berechnet.','info@financecare.de · Königstr. 73, Nürnberg'].join('\n');}
  const api={questions,buildPlan,validAnswers,labelFor,planText};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FinanzCareLogic=api;
})(typeof window!=='undefined'?window:globalThis);
