import json

T = "supply-chain"
data = {}

# 261 - Present simple vs present continuous for operations
data["261"] = [
 {"title":"Open cloze — present simple vs present continuous (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"We ___ the inventory dashboard every Monday morning before the operations call.","a":"check / review / monitor"},
   {"q":"Right now, raw sugar ___ piling up at the Rotterdam terminal because the trucks are late.","a":"is"},
   {"q":"As a rule, the planning team ___ not release stock until the forecast is confirmed.","a":"does"},
   {"q":"This week we ___ running below safety stock on three key SKUs.","a":"are"},
   {"q":"The system normally ___ a reorder when stock falls under the trigger level.","a":"triggers / generates"},
   {"q":"At the moment, two of our suppliers ___ struggling to meet their shipment dates.","a":"are"},
   {"q":"Czarnikow ___ thousands of tonnes of sugar across the chain every quarter.","a":"moves / handles / ships"},
   {"q":"Inventory ___ thinning out at the port this week, so we are watching it closely.","a":"is"},
   {"q":"How often ___ you reconcile the physical count with the system figures?","a":"do"},
   {"q":"I ___ currently mapping the flow because we keep missing the hidden delays.","a":"am"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"Our routine is to review the dashboard once a week.  ·  (REVIEW)  ·  We ___ the dashboard once a week.","a":"review"},
   {"q":"At this moment, stock is building up at the port.  ·  (PILING)  ·  Stock ___ at the port right now.","a":"is piling up"},
   {"q":"It is not our habit to ship without an inspection.  ·  (NORMALLY)  ·  We ___ ship without an inspection.","a":"normally do not / don't normally"},
   {"q":"This week the team is testing a new flow.  ·  (TRYING)  ·  This week the team ___ a new flow.","a":"is trying out / is trying"},
   {"q":"As a general rule, the supplier delivers on Tuesdays.  ·  (USUALLY)  ·  The supplier ___ on Tuesdays.","a":"usually delivers"},
   {"q":"At present, demand is changing fast.  ·  (SHIFTING)  ·  Demand ___ fast at the moment.","a":"is shifting"}]},
 {"title":"Multiple-choice cloze — escolha a forma correta","note":"Marque a opção certa.","items":[
   {"q":"Every Monday we ___ the open-order report. (a) are reviewing (b) review (c) reviews","a":"(b) review"},
   {"q":"This week inventory ___ at the terminal. (a) is piling up (b) piles up (c) pile up","a":"(a) is piling up"},
   {"q":"The plant ___ around the clock during the harvest. (a) is running normally (b) runs (c) run","a":"(b) runs"},
   {"q":"Look at the screen — the container ___ customs right now. (a) clears (b) clear (c) is clearing","a":"(c) is clearing"},
   {"q":"Czarnikow ___ sugar to refineries across Europe. (a) ship (b) ships (c) is shipping","a":"(b) ships"},
   {"q":"At the moment, two carriers ___ behind schedule. (a) run (b) runs (c) are running","a":"(c) are running"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"We are checking the dashboard every Monday.","a":"We check the dashboard every Monday. (rotina → present simple)"},
   {"q":"Right now the stock pile up at the port.","a":"Right now the stock is piling up at the port. (ação acontecendo agora → present continuous)"},
   {"q":"The supplier deliver on Tuesdays.","a":"The supplier delivers on Tuesdays. (3ª pessoa do singular → -s)"},
   {"q":"This week we monitoring inventory very closely.","a":"This week we are monitoring inventory very closely. (falta o auxiliar are)"},
   {"q":"Czarnikow are moving thousands of tonnes every quarter as a rule.","a":"Czarnikow moves thousands of tonnes every quarter. (fato/rotina → present simple)"},
   {"q":"How often are you reconcile the count?","a":"How often do you reconcile the count? (rotina, pergunta → do + base)"}]},
 {"title":"Collocations & vocabulary building — operações (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to run an operation","a":"tocar/gerir uma operação"},
   {"q":"to keep the flow moving","a":"manter o fluxo andando"},
   {"q":"to clear a backlog","a":"zerar um acúmulo/pendência"},
   {"q":"around the clock","a":"24 horas por dia"},
   {"q":"on a weekly basis","a":"semanalmente"},
   {"q":"to fall behind schedule","a":"ficar atrasado no cronograma"},
   {"q":"to ramp up production","a":"acelerar a produção"},
   {"q":"to flag an issue","a":"sinalizar um problema"},
   {"q":"a bottleneck","a":"um gargalo"},
   {"q":"to stay on top of something","a":"manter algo sob controle"}]},
 {"title":"Fale sobre você / Discuss — simple vs continuous no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What do you check on a typical working day?","a":"On a typical day I check the open orders, the stock levels and any delays flagged by the carriers."},
   {"q":"What are you working on this week that is not part of your routine?","a":"This week I am mapping our inbound flow because we keep losing time at the hand-offs."},
   {"q":"How often does your team review performance, and what do you look at?","a":"My team reviews performance every Monday, and we look at service level, inventory and exceptions."},
   {"q":"What is happening in your operation right now that worries you?","a":"Right now stock is building up at one site, so I am watching the reorder rules closely."},
   {"q":"What does a smooth week usually look like for you?","a":"A smooth week usually means orders ship on time and no SKU runs below safety stock."},
   {"q":"What process are you currently trying to improve?","a":"I am currently trying to shorten the cycle time, so I am testing a faster picking route this month."}]}
]

# 262 - Relative clauses (who, that)
data["262"] = [
 {"title":"Open cloze — orações relativas (who/that/which) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"The supplier ___ delivers on time is the partner we want to keep.","a":"who / that"},
   {"q":"The contract ___ expires next month still needs to be renewed.","a":"that / which"},
   {"q":"Oliver is the planner ___ manages our Brazilian sourcing.","a":"who / that"},
   {"q":"We rely on carriers ___ communicate delays early.","a":"that / who / which"},
   {"q":"The pallet ___ was damaged in transit has been removed from stock.","a":"that / which"},
   {"q":"Emily is the colleague ___ trained the new warehouse team.","a":"who / that"},
   {"q":"This is the terminal ___ handles most of our European volume.","a":"that / which"},
   {"q":"Partners ___ trust you tend to share information sooner.","a":"who / that"},
   {"q":"The forecast ___ the planning team produced last week was very accurate.","a":"that / which / —"},
   {"q":"Any vendor ___ misses three deadlines goes onto a watch list.","a":"who / that"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"This supplier delivers on time. We want to keep him.  ·  (WHO)  ·  The supplier ___ is the one we want to keep.","a":"who delivers on time"},
   {"q":"That contract expires soon. It needs renewing.  ·  (THAT)  ·  The contract ___ needs renewing.","a":"that expires soon"},
   {"q":"Oliver manages Brazilian sourcing. He is very experienced.  ·  (WHO)  ·  Oliver, ___ , is very experienced.","a":"who manages Brazilian sourcing"},
   {"q":"The carrier broke down. It caused the delay.  ·  (THAT)  ·  The delay was caused by the carrier ___ down.","a":"that broke"},
   {"q":"Emily trained the team. She is our supervisor.  ·  (WHO)  ·  Emily is the supervisor ___ the team.","a":"who trained"},
   {"q":"That terminal handles most volume. We use it daily.  ·  (THAT)  ·  We use the terminal ___ most volume.","a":"that handles"}]},
 {"title":"Multiple-choice cloze — escolha o pronome relativo","note":"Marque a opção certa.","items":[
   {"q":"The supplier ___ delivers early is our priority. (a) which (b) who (c) what","a":"(b) who"},
   {"q":"The shipment ___ left yesterday is delayed. (a) who (b) whose (c) that","a":"(c) that"},
   {"q":"She is the manager ___ signed the framework agreement. (a) who (b) which (c) where","a":"(a) who"},
   {"q":"Any pallet ___ is damaged must be logged. (a) who (b) that (c) whom","a":"(b) that"},
   {"q":"The carriers ___ communicate well get more lanes. (a) which (b) what (c) that","a":"(c) that"},
   {"q":"This is the port ___ handles our refined sugar. (a) who (b) that (c) whose","a":"(b) that"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"The supplier which delivers on time is our best partner.","a":"The supplier who/that delivers on time is our best partner. (pessoa → who/that, não which)"},
   {"q":"The contract who expires next month needs renewal.","a":"The contract that/which expires next month needs renewal. (coisa → that/which, não who)"},
   {"q":"Oliver is the planner he manages our sourcing.","a":"Oliver is the planner who manages our sourcing. (precisa do pronome relativo who, não he)"},
   {"q":"We work with carriers what communicate early.","a":"We work with carriers that/who communicate early. (relativo correto é that/who, não what)"},
   {"q":"The pallet was damaged it has been removed.","a":"The pallet that was damaged has been removed. (oração relativa precisa de that, não it)"},
   {"q":"Emily is the colleague who trained the team last week she is excellent.","a":"Emily, who trained the team last week, is excellent. (usar oração relativa, não duas frases coladas)"}]},
 {"title":"Collocations & vocabulary building — parceiros e fornecedores (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"a reliable partner","a":"um parceiro confiável"},
   {"q":"to build a relationship","a":"construir um relacionamento"},
   {"q":"to onboard a supplier","a":"integrar/cadastrar um fornecedor"},
   {"q":"a preferred vendor","a":"um fornecedor preferencial"},
   {"q":"to hold someone accountable","a":"responsabilizar alguém"},
   {"q":"to deliver on a promise","a":"cumprir o prometido"},
   {"q":"a single point of contact","a":"um ponto único de contato"},
   {"q":"to nurture a partnership","a":"cultivar uma parceria"},
   {"q":"a watch list","a":"uma lista de observação"},
   {"q":"to fall short","a":"ficar aquém"}]},
 {"title":"Fale sobre você / Discuss — orações relativas no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"Describe a partner who you trust the most. Why?","a":"My most trusted partner is a carrier who always warns us early when a delay is likely."},
   {"q":"Tell me about a contract that needs attention soon.","a":"There is a framework agreement that expires this quarter, so I need to start the renewal now."},
   {"q":"Who is the colleague that helps you most in a crisis?","a":"The colleague who helps me most is our planner, because she finds the data that explains the problem."},
   {"q":"What kind of supplier do you avoid?","a":"I avoid any supplier that misses deadlines without telling us, because it puts our service at risk."},
   {"q":"Describe a process that you would like to change.","a":"There is a sign-off step that slows everything down, so it is the process I would change first."},
   {"q":"Which team member should get more responsibility, and why?","a":"The person who trained our new staff should get more, because she is the one others rely on."}]}
]

# 263 - Passive voice for processes
data["263"] = [
 {"title":"Open cloze — voz passiva para processos (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"The order ___ received and logged in the system within minutes.","a":"is"},
   {"q":"Each pallet ___ picked and scanned before it leaves the bay.","a":"is"},
   {"q":"The containers ___ sealed once the inspection is complete.","a":"are"},
   {"q":"The shipment is ___ by the carrier at noon.","a":"dispatched / collected"},
   {"q":"The goods ___ inspected for moisture before they are accepted.","a":"are"},
   {"q":"The container is ___ by customs at the port of entry.","a":"cleared"},
   {"q":"All hand-offs ___ recorded so that delays can be traced.","a":"are"},
   {"q":"The invoice ___ generated automatically once the parcel is delivered.","a":"is"},
   {"q":"Damaged units ___ removed from the count and reported the same day.","a":"are"},
   {"q":"The forecast is ___ every Friday by the planning team.","a":"refreshed / updated"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"The team receives the order.  ·  (RECEIVED)  ·  The order ___ by the team.","a":"is received"},
   {"q":"Customs clears the container.  ·  (CLEARED)  ·  The container ___ by customs.","a":"is cleared"},
   {"q":"Someone seals the pallets before dispatch.  ·  (SEALED)  ·  The pallets ___ before dispatch.","a":"are sealed"},
   {"q":"They inspect the goods on arrival.  ·  (INSPECTED)  ·  The goods ___ on arrival.","a":"are inspected"},
   {"q":"The system generates the invoice.  ·  (GENERATED)  ·  The invoice ___ by the system.","a":"is generated"},
   {"q":"Workers pick and pack the parcels.  ·  (PACKED)  ·  The parcels ___ by workers.","a":"are picked and packed"}]},
 {"title":"Multiple-choice cloze — escolha a forma passiva","note":"Marque a opção certa.","items":[
   {"q":"The order ___ as soon as it arrives. (a) is logged (b) logs (c) logging","a":"(a) is logged"},
   {"q":"The containers ___ before they are sealed. (a) inspects (b) are inspected (c) inspect","a":"(b) are inspected"},
   {"q":"The shipment ___ by the carrier at noon. (a) collected (b) is collected (c) collecting","a":"(b) is collected"},
   {"q":"Damaged goods ___ from the count. (a) are removed (b) remove (c) is removed","a":"(a) are removed"},
   {"q":"The container ___ by customs at the port. (a) clear (b) is cleared (c) clearing","a":"(b) is cleared"},
   {"q":"The pallets ___ and scanned in the bay. (a) is picked (b) picks (c) are picked","a":"(c) are picked"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"The order is receive within minutes.","a":"The order is received within minutes. (passiva = be + particípio, received)"},
   {"q":"The containers is sealed after inspection.","a":"The containers are sealed after inspection. (sujeito plural → are)"},
   {"q":"The goods are inspect on arrival.","a":"The goods are inspected on arrival. (falta o particípio passado, inspected)"},
   {"q":"The container clears by customs at the port.","a":"The container is cleared by customs at the port. (ação sofrida → passiva: is cleared)"},
   {"q":"The invoice is generate automatically.","a":"The invoice is generated automatically. (particípio: generated)"},
   {"q":"Damaged units are removed and reported by the same day.","a":"Damaged units are removed and reported the same day. (expressão de tempo sem by: the same day)"}]},
 {"title":"Collocations & vocabulary building — fluxo do processo (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to be picked and packed","a":"ser separado e embalado"},
   {"q":"to be cleared by customs","a":"ser liberado pela alfândega"},
   {"q":"to be logged in the system","a":"ser registrado no sistema"},
   {"q":"a process step","a":"uma etapa do processo"},
   {"q":"to trace a delay","a":"rastrear um atraso"},
   {"q":"a hand-off point","a":"um ponto de passagem"},
   {"q":"to be flagged for review","a":"ser sinalizado para revisão"},
   {"q":"to be signed off","a":"ser aprovado/validado"},
   {"q":"to be put on hold","a":"ser colocado em espera"},
   {"q":"to be routed to","a":"ser encaminhado para"}]},
 {"title":"Fale sobre você / Discuss — voz passiva no seu processo","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"How is an order processed in your operation, step by step?","a":"The order is received, the items are picked, the box is packed and the parcel is dispatched."},
   {"q":"What is checked before goods are accepted?","a":"The goods are inspected for damage and the quantity is verified against the order."},
   {"q":"Where is most time lost in your process?","a":"Most time is lost where the shipment is held for documents before it is cleared."},
   {"q":"How are delays recorded and reported?","a":"Each hand-off is logged, so any delay is traced and reported the same day."},
   {"q":"What is done automatically and what is done by hand?","a":"The invoice is generated automatically, but the inspection is still done by hand."},
   {"q":"What step would you redesign first, and why?","a":"I would redesign the sign-off step, because the order is often held there for no real reason."}]}
]

# 264 - Second conditional (would)
data["264"] = [
 {"title":"Open cloze — segundo condicional (would) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"If demand ___ more predictable, we would run a make-to-stock model.","a":"were / was"},
   {"q":"If we chose make-to-order, we ___ need a smaller warehouse.","a":"would"},
   {"q":"If the harvest ___ stable, we would hold less safety stock.","a":"were / was"},
   {"q":"We would switch to a hybrid model if the demand ___ harder to forecast.","a":"got / became / were"},
   {"q":"If I ___ in your position, I would not commit to that lead time.","a":"were / was"},
   {"q":"The buyer would carry all the risk if we ___ EXW terms.","a":"used"},
   {"q":"If the supplier ___ deliver weekly, we ___ avoid stockouts.","a":"could / would"},
   {"q":"We ___ run leaner if the lead time were shorter.","a":"would / could"},
   {"q":"If volumes ___ smaller, a make-to-order model would make sense.","a":"were / was"},
   {"q":"It ___ be cheaper if we consolidated the two lanes.","a":"would"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"Demand is not predictable, so we don't run make-to-stock.  ·  (WOULD)  ·  If demand were predictable, we ___ make-to-stock.","a":"would run"},
   {"q":"We don't use EXW, so the buyer doesn't carry the port work.  ·  (USED)  ·  If we ___ EXW, the buyer would carry the port work.","a":"used"},
   {"q":"The lead time is long, so we can't run lean.  ·  (WERE)  ·  If the lead time ___ shorter, we could run lean.","a":"were"},
   {"q":"I'm not the buyer, so I can't decide.  ·  (WERE)  ·  If I ___ the buyer, I would decide.","a":"were"},
   {"q":"Volumes are large, so make-to-order doesn't fit.  ·  (SMALLER)  ·  If volumes ___ , make-to-order would fit.","a":"were smaller"},
   {"q":"We don't consolidate the lanes, so costs stay high.  ·  (CONSOLIDATED)  ·  If we ___ the lanes, costs would fall.","a":"consolidated"}]},
 {"title":"Multiple-choice cloze — escolha a forma correta","note":"Marque a opção certa.","items":[
   {"q":"If demand were stable, we ___ make-to-stock. (a) will run (b) would run (c) run","a":"(b) would run"},
   {"q":"If I ___ you, I would renegotiate the terms. (a) was (b) am (c) were","a":"(c) were"},
   {"q":"We would save money if we ___ the two lanes. (a) consolidate (b) consolidated (c) will consolidate","a":"(b) consolidated"},
   {"q":"If the harvest failed, prices ___ rise sharply. (a) would (b) will (c) would have","a":"(a) would"},
   {"q":"If we used EXW, the buyer ___ all the risk. (a) take (b) would take (c) took","a":"(b) would take"},
   {"q":"It would be smarter if we ___ a hybrid model. (a) chose (b) choose (c) will choose","a":"(a) chose"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"If demand was predictable, we will run make-to-stock.","a":"If demand were predictable, we would run make-to-stock. (segundo condicional → would, não will)"},
   {"q":"If we would use EXW, the buyer would carry the risk.","a":"If we used EXW, the buyer would carry the risk. (na if-clause usa-se passado simples, não would)"},
   {"q":"If I am the buyer, I would renegotiate.","a":"If I were the buyer, I would renegotiate. (situação irreal → were/past)"},
   {"q":"We would run leaner if the lead time is shorter.","a":"We would run leaner if the lead time were shorter. (condição irreal → past, were)"},
   {"q":"If volumes were smaller, make-to-order will fit.","a":"If volumes were smaller, make-to-order would fit. (resultado irreal → would, não will)"},
   {"q":"It would be cheaper if we will consolidate the lanes.","a":"It would be cheaper if we consolidated the lanes. (if-clause → past simple)"}]},
 {"title":"Collocations & vocabulary building — modelos de cadeia (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"make-to-stock","a":"produzir para estoque"},
   {"q":"make-to-order","a":"produzir sob encomenda"},
   {"q":"to weigh the trade-offs","a":"ponderar os prós e contras"},
   {"q":"to carry the risk","a":"assumir o risco"},
   {"q":"a demand pattern","a":"um padrão de demanda"},
   {"q":"to fit the model to the product","a":"adequar o modelo ao produto"},
   {"q":"a hybrid approach","a":"uma abordagem híbrida"},
   {"q":"to lock in capacity","a":"reservar/garantir capacidade"},
   {"q":"to run lean","a":"operar enxuto"},
   {"q":"a buffer of stock","a":"um colchão de estoque"}]},
 {"title":"Fale sobre você / Discuss — segundo condicional no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"If you could change one part of your supply chain, what would it be?","a":"If I could change one thing, I would shorten the lead time so we could hold less stock."},
   {"q":"If demand were perfectly predictable, how would you run things?","a":"If demand were perfectly predictable, I would run make-to-stock and keep a very thin buffer."},
   {"q":"If your main supplier failed tomorrow, what would you do?","a":"If my main supplier failed, I would switch part of the volume to our backup lane immediately."},
   {"q":"If you had a bigger budget, where would you invest it?","a":"If I had a bigger budget, I would invest in better forecasting tools to reduce uncertainty."},
   {"q":"If you were the customer, what would you expect from your chain?","a":"If I were the customer, I would expect on-time delivery and clear communication about any delay."},
   {"q":"If lead times doubled, how would your model change?","a":"If lead times doubled, I would move to make-to-stock and build a larger safety buffer."}]}
]

# 265 - Signal phrases
data["265"] = [
 {"title":"Open cloze — frases de sinalização de dados (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"The reorder data suggests ___ demand is starting to shift.","a":"that"},
   {"q":"This ___ us that supply is tightening upstream.","a":"tells"},
   {"q":"The flat sales line is a ___ of weak underlying demand.","a":"sign"},
   {"q":"The figures ___ that the distributor is overstocking.","a":"indicate / suggest / show"},
   {"q":"It ___ that the promotion pulled demand forward.","a":"suggests / appears / seems"},
   {"q":"The spike in reorders ___ us a crisis may be building.","a":"tells"},
   {"q":"That pattern ___ a sign of panic buying downstream.","a":"is"},
   {"q":"The data ___ that lead times are creeping up.","a":"indicates / suggests / shows"},
   {"q":"This points ___ a structural change, not a one-off.","a":"to"},
   {"q":"What this ___ us is that we should act this week.","a":"tells"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"I think demand is dropping.  ·  (SUGGESTS)  ·  The data ___ demand is dropping.","a":"suggests that"},
   {"q":"Supply is clearly tightening.  ·  (TELLS)  ·  This ___ supply is tightening.","a":"tells us that"},
   {"q":"The flat line means demand is weak.  ·  (SIGN)  ·  The flat line is ___ weak demand.","a":"a sign of"},
   {"q":"The figures clearly show a problem.  ·  (INDICATE)  ·  The figures ___ a problem.","a":"indicate"},
   {"q":"Maybe the promotion pulled demand forward.  ·  (SUGGESTS)  ·  It ___ the promotion pulled demand forward.","a":"suggests that"},
   {"q":"This is evidence of a real shift.  ·  (POINTS)  ·  This ___ a real shift.","a":"points to"}]},
 {"title":"Multiple-choice cloze — escolha a frase de sinalização","note":"Marque a opção certa.","items":[
   {"q":"The data ___ that demand is shifting. (a) suggest (b) suggests (c) suggesting","a":"(b) suggests"},
   {"q":"This ___ us supply is tightening. (a) says (b) tells (c) speaks","a":"(b) tells"},
   {"q":"The flat line is a sign ___ weak demand. (a) of (b) for (c) to","a":"(a) of"},
   {"q":"The figures ___ a structural change. (a) point at (b) point to (c) point on","a":"(b) point to"},
   {"q":"It ___ that the promotion distorted the signal. (a) appears (b) appear (c) appearing","a":"(a) appears"},
   {"q":"What this tells us ___ that we must act now. (a) are (b) is (c) be","a":"(b) is"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"The data suggest that demand is shifting.","a":"The data suggests that demand is shifting. (data como bloco singular aqui → suggests)"},
   {"q":"This tells to us that supply is tightening.","a":"This tells us that supply is tightening. (tell + objeto direto us, sem to)"},
   {"q":"The flat line is a sign for weak demand.","a":"The flat line is a sign of weak demand. (colocação correta: a sign of)"},
   {"q":"The figures indicates a problem.","a":"The figures indicate a problem. (sujeito plural figures → indicate)"},
   {"q":"It suggests demand pulling forward.","a":"It suggests that demand was pulled forward. (suggest + that-clause; sentido passivo claro)"},
   {"q":"This points at a structural change.","a":"This points to a structural change. (colocação: point to)"}]},
 {"title":"Collocations & vocabulary building — leitura de sinais (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"an early warning sign","a":"um sinal de alerta antecipado"},
   {"q":"to read between the lines","a":"ler nas entrelinhas"},
   {"q":"a leading indicator","a":"um indicador antecedente"},
   {"q":"to pick up a signal","a":"captar um sinal"},
   {"q":"to point to a trend","a":"apontar para uma tendência"},
   {"q":"a one-off spike","a":"um pico isolado"},
   {"q":"to distort the data","a":"distorcer os dados"},
   {"q":"a red flag","a":"um sinal de alerta"},
   {"q":"underlying demand","a":"demanda subjacente"},
   {"q":"to act on a signal","a":"agir com base em um sinal"}]},
 {"title":"Fale sobre você / Discuss — frases de sinalização no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What does your latest data suggest about demand?","a":"The data suggests that demand is softening in one region, so we are watching reorders closely."},
   {"q":"What early signal do you watch most carefully?","a":"The signal I watch most is a sudden jump in reorders, because it often tells us a shortage is coming."},
   {"q":"How do you separate a real trend from a one-off?","a":"I compare several weeks; if the pattern holds, it indicates a real shift rather than a one-off spike."},
   {"q":"When did a signal tell you to act, and what did you do?","a":"Last quarter the figures suggested a supplier problem, so we moved volume to a backup early."},
   {"q":"What does a flat sales line tell you in your business?","a":"A flat line usually tells us that a promotion is hiding the real underlying demand."},
   {"q":"How do you present a worrying signal to your manager?","a":"I say the data indicates a risk and then suggest a concrete action for this week."}]}
]

# 266 - Present perfect for recent events
data["266"] = [
 {"title":"Open cloze — present perfect para eventos recentes (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"We ___ built five framework agreements this year.","a":"have"},
   {"q":"Oliver ___ reduced ad-hoc purchasing by sixty per cent.","a":"has"},
   {"q":"The team ___ standardised the approved supplier list.","a":"has"},
   {"q":"We ___ already signed the new sourcing contract.","a":"have"},
   {"q":"Procurement has ___ stopped renegotiating every repeat purchase.","a":"just / already / recently"},
   {"q":"How many deals ___ you closed this quarter?","a":"have"},
   {"q":"We ___ not finalised the strategic supplier review ___ .","a":"have / yet"},
   {"q":"Costs ___ fallen since we introduced the framework agreements.","a":"have"},
   {"q":"She ___ recently noticed an inconsistency in the pricing.","a":"has"},
   {"q":"___ the team approved the new vendor yet?","a":"Has"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"We built the framework agreements and they exist now.  ·  (HAVE)  ·  We ___ five framework agreements.","a":"have built"},
   {"q":"Oliver reduced ad-hoc buying; the result is current.  ·  (HAS)  ·  Oliver ___ ad-hoc buying.","a":"has reduced"},
   {"q":"The team standardised the list a moment ago.  ·  (JUST)  ·  The team ___ the list.","a":"has just standardised"},
   {"q":"This is the first time we have used this supplier.  ·  (NEVER)  ·  We ___ this supplier before.","a":"have never used"},
   {"q":"The review is not finished.  ·  (YET)  ·  We ___ the review yet.","a":"haven't finished"},
   {"q":"We started using framework deals and costs are now lower.  ·  (SINCE)  ·  Costs have fallen ___ we introduced framework deals.","a":"since"}]},
 {"title":"Multiple-choice cloze — escolha a forma correta","note":"Marque a opção certa.","items":[
   {"q":"We ___ the supplier list, so it is current. (a) have standardised (b) standardised (c) standardise","a":"(a) have standardised"},
   {"q":"Oliver has worked in procurement ___ 2018. (a) for (b) since (c) from","a":"(b) since"},
   {"q":"___ you closed the deal yet? (a) Did (b) Are (c) Have","a":"(c) Have"},
   {"q":"We haven't approved the vendor ___ . (a) already (b) yet (c) since","a":"(b) yet"},
   {"q":"This is the best agreement we ___ signed. (a) have ever (b) ever have (c) had ever","a":"(a) have ever"},
   {"q":"Costs ___ fallen since the change. (a) has (b) have (c) having","a":"(b) have"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"We have built the agreement last year.","a":"We built the agreement last year. (tempo definido no passado → simple past)"},
   {"q":"Oliver has reduce ad-hoc purchasing.","a":"Oliver has reduced ad-hoc purchasing. (particípio: reduced)"},
   {"q":"The team have standardised the list.","a":"The team has standardised the list. (the team como unidade → has)"},
   {"q":"We have signed the contract since two weeks.","a":"We signed the contract two weeks ago. (ponto no passado → ago + simple past)"},
   {"q":"Has you approved the new vendor yet?","a":"Have you approved the new vendor yet? (you → have)"},
   {"q":"Costs have fall a lot this year.","a":"Costs have fallen a lot this year. (particípio de fall = fallen)"}]},
 {"title":"Collocations & vocabulary building — compras/procurement (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to negotiate a contract","a":"negociar um contrato"},
   {"q":"to source from","a":"comprar/abastecer de"},
   {"q":"to lock in a price","a":"travar um preço"},
   {"q":"a purchase order (PO)","a":"uma ordem de compra"},
   {"q":"to cut costs","a":"reduzir custos"},
   {"q":"to vet a supplier","a":"avaliar/qualificar um fornecedor"},
   {"q":"to consolidate spend","a":"consolidar os gastos"},
   {"q":"a volume discount","a":"um desconto por volume"},
   {"q":"to renew a contract","a":"renovar um contrato"},
   {"q":"to bring something in-house","a":"internalizar algo"}]},
 {"title":"Fale sobre você / Discuss — present perfect no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What have you achieved in procurement this year?","a":"This year I have signed two framework agreements and we have cut ad-hoc spending sharply."},
   {"q":"How long have you sourced from your main supplier?","a":"I have sourced from our main supplier for four years, and the relationship has improved a lot."},
   {"q":"What has changed recently in how you buy?","a":"We have standardised the approved supplier list, so the team has stopped renegotiating every order."},
   {"q":"Have you ever dealt with a supplier who failed? What happened?","a":"Yes, I have. We have moved that volume to a backup and tightened our vetting since then."},
   {"q":"What cost saving have you delivered lately?","a":"I have consolidated our spend with three vendors, and that has saved us a meaningful amount."},
   {"q":"What haven't you finished in procurement this quarter?","a":"I haven't completed the strategic supplier review yet, but I expect to close it next week."}]}
]

# 267 - First conditional
data["267"] = [
 {"title":"Open cloze — primeiro condicional (if + will) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"If stock ___ below the safety level, the system will trigger a reorder.","a":"falls / drops"},
   {"q":"If we get the A items right, the rest ___ breathe.","a":"will"},
   {"q":"If we ignore the A items, nothing ___ compensate.","a":"will"},
   {"q":"The reorder ___ fire automatically if the SKU hits its trigger.","a":"will"},
   {"q":"If a count ___ off by more than five per cent, we will investigate.","a":"is"},
   {"q":"If the A items linger in stock, working capital ___ suffer.","a":"will"},
   {"q":"We ___ run a daily review if the variability stays high.","a":"will"},
   {"q":"If you ___ on the top SKUs, the C items will mostly look after themselves.","a":"focus / concentrate"},
   {"q":"The service level will slip if we ___ the adjustments.","a":"miss / skip / ignore"},
   {"q":"If we automate the rule, the team ___ not have to chase every line.","a":"will"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"Get the A items right and the rest is fine.  ·  (WILL)  ·  If we get the A items right, the rest ___ fine.","a":"will be"},
   {"q":"Without attention, the A items cause problems.  ·  (IGNORE)  ·  If we ___ the A items, problems will follow.","a":"ignore"},
   {"q":"Low stock means the system reorders.  ·  (FALLS)  ·  If stock ___ , the system will reorder.","a":"falls"},
   {"q":"High variability requires a daily review.  ·  (STAYS)  ·  If variability ___ high, we will review daily.","a":"stays"},
   {"q":"Automation removes the chasing.  ·  (AUTOMATE)  ·  If we ___ the rule, no one will chase lines.","a":"automate"},
   {"q":"Miss the adjustments and service slips.  ·  (SKIP)  ·  If we ___ the adjustments, service will slip.","a":"skip"}]},
 {"title":"Multiple-choice cloze — escolha a forma correta","note":"Marque a opção certa.","items":[
   {"q":"If stock falls below the level, the system ___ a reorder. (a) trigger (b) will trigger (c) triggered","a":"(b) will trigger"},
   {"q":"If we ___ the A items, nothing will compensate. (a) ignore (b) will ignore (c) ignored","a":"(a) ignore"},
   {"q":"Service ___ if we skip the daily adjustments. (a) slips (b) will slip (c) slip","a":"(b) will slip"},
   {"q":"If variability ___ high, we will review daily. (a) will stay (b) stays (c) stayed","a":"(b) stays"},
   {"q":"The team won't chase lines if we ___ the rule. (a) automate (b) will automate (c) automated","a":"(a) automate"},
   {"q":"If a count is off, we ___ it the same day. (a) investigate (b) will investigate (c) investigated","a":"(b) will investigate"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"If stock will fall below the level, the system reorders.","a":"If stock falls below the level, the system will reorder. (if-clause → present; resultado → will)"},
   {"q":"If we get the A items right, the rest breathes will.","a":"If we get the A items right, the rest will breathe. (ordem correta: will + base)"},
   {"q":"Service will slip if we will skip the adjustments.","a":"Service will slip if we skip the adjustments. (if-clause → present simple)"},
   {"q":"If a count is off, we investigating it the same day.","a":"If a count is off, we will investigate it the same day. (resultado real futuro → will + base)"},
   {"q":"If variability stays high, we reviewing daily.","a":"If variability stays high, we will review daily. (falta will; resultado provável)"},
   {"q":"Nothing will compensate if we ignored the A items.","a":"Nothing will compensate if we ignore the A items. (primeiro condicional → present, não past)"}]},
 {"title":"Collocations & vocabulary building — gestão de estoque (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"safety stock","a":"estoque de segurança"},
   {"q":"a reorder point","a":"um ponto de reposição"},
   {"q":"to run out of stock","a":"ficar sem estoque"},
   {"q":"a stockout","a":"uma ruptura de estoque"},
   {"q":"dead stock","a":"estoque parado"},
   {"q":"stock turnover","a":"giro de estoque"},
   {"q":"to tie up working capital","a":"imobilizar capital de giro"},
   {"q":"to replenish stock","a":"repor estoque"},
   {"q":"a fast-moving item","a":"um item de alto giro"},
   {"q":"to write off stock","a":"baixar/descartar estoque"}]},
 {"title":"Fale sobre você / Discuss — primeiro condicional no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What happens in your system if stock falls below the safety level?","a":"If stock falls below the safety level, the system will trigger an automatic reorder."},
   {"q":"What will go wrong if you ignore your A items?","a":"If we ignore the A items, our service level will slip and nothing else will compensate."},
   {"q":"Under what condition will you escalate an inventory issue?","a":"If a count is off by more than five per cent, I will escalate it to my manager the same day."},
   {"q":"What will improve if you automate your reorder rules?","a":"If we automate the rules, the team will stop chasing lines and will focus on the exceptions."},
   {"q":"What will you do if a key SKU runs out?","a":"If a key SKU runs out, I will pull stock from another site and expedite the next shipment."},
   {"q":"What happens if demand spikes unexpectedly?","a":"If demand spikes, we will draw on our safety stock and raise the reorder quantity for that item."}]}
]

# 268 - Modal obligations (must, have to, need to)
data["268"] = [
 {"title":"Open cloze — modais de obrigação (must/have to/need to) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"Cycle counts ___ happen daily — that is a firm rule here.","a":"must"},
   {"q":"We ___ to clear the bays by ten because the deliveries arrive then.","a":"have"},
   {"q":"You ___ to know the team's capacity before you assign tasks.","a":"need"},
   {"q":"Damaged goods ___ be investigated the same week.","a":"must"},
   {"q":"The forklift drivers ___ to hold a valid certificate.","a":"have"},
   {"q":"We ___ to run the safety drill once a month — it is the law.","a":"have"},
   {"q":"You really ___ to recount that bay; the figures look wrong.","a":"need"},
   {"q":"Picking errors ___ be logged immediately, no exceptions.","a":"must"},
   {"q":"The walk-through ___ happen before eight a.m. every day.","a":"must"},
   {"q":"We don't ___ to count every SKU daily, only the A items.","a":"have"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"It is a strict rule to count stock daily.  ·  (MUST)  ·  Stock ___ daily.","a":"must be counted"},
   {"q":"The schedule forces us to clear the bays by ten.  ·  (HAVE)  ·  We ___ the bays by ten.","a":"have to clear"},
   {"q":"It is necessary to know capacity first.  ·  (NEED)  ·  You ___ capacity first.","a":"need to know"},
   {"q":"It is not necessary to count every item daily.  ·  (HAVE)  ·  We ___ count every item daily.","a":"don't have to"},
   {"q":"Logging the error is compulsory.  ·  (MUST)  ·  The error ___ .","a":"must be logged"},
   {"q":"The law requires a monthly safety drill.  ·  (HAVE)  ·  We ___ a safety drill monthly.","a":"have to run"}]},
 {"title":"Multiple-choice cloze — escolha o modal correto","note":"Marque a opção certa.","items":[
   {"q":"Cycle counts ___ happen daily; it is our rule. (a) must (b) might (c) could","a":"(a) must"},
   {"q":"We ___ clear the bays by ten because trucks arrive then. (a) need not (b) have to (c) mustn't","a":"(b) have to"},
   {"q":"You ___ know the capacity before assigning tasks. (a) need to (b) must not (c) don't have to","a":"(a) need to"},
   {"q":"We ___ count every SKU daily, only the A items. (a) must (b) don't have to (c) have to","a":"(b) don't have to"},
   {"q":"Drivers ___ hold a valid certificate by law. (a) have to (b) need not (c) mustn't","a":"(a) have to"},
   {"q":"Damaged goods ___ be left unrecorded. (a) must (b) have to (c) must not","a":"(c) must not"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"Cycle counts must to happen daily.","a":"Cycle counts must happen daily. (must + base, sem to)"},
   {"q":"We must clear the bays by ten because the law requires it.","a":"We have to clear the bays by ten because the law requires it. (obrigação externa → have to)"},
   {"q":"You need know the capacity first.","a":"You need to know the capacity first. (need to + base)"},
   {"q":"We don't must count every SKU daily.","a":"We don't have to count every SKU daily. (ausência de obrigação → don't have to)"},
   {"q":"Drivers has to hold a certificate.","a":"Drivers have to hold a certificate. (sujeito plural → have to)"},
   {"q":"Damaged goods must not to be left unrecorded.","a":"Damaged goods must not be left unrecorded. (must not + base, sem to)"}]},
 {"title":"Collocations & vocabulary building — operação de armazém (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to put away stock","a":"armazenar/endereçar o estoque"},
   {"q":"a picking list","a":"uma lista de separação"},
   {"q":"to stick to a routine","a":"manter a rotina"},
   {"q":"a near miss","a":"um quase acidente"},
   {"q":"to comply with a regulation","a":"cumprir uma norma"},
   {"q":"to log a discrepancy","a":"registrar uma divergência"},
   {"q":"a goods-in area","a":"uma área de recebimento"},
   {"q":"to keep the aisles clear","a":"manter os corredores livres"},
   {"q":"to carry out a drill","a":"realizar um simulado"},
   {"q":"a steady throughput","a":"um fluxo de processamento constante"}]},
 {"title":"Fale sobre você / Discuss — modais de obrigação no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What must always happen in your operation, with no exceptions?","a":"In my operation, every safety check must happen before the shift starts, with no exceptions."},
   {"q":"What do you have to do because of external rules or schedules?","a":"We have to clear the inbound bays early because the next deliveries arrive at a fixed time."},
   {"q":"What do new team members need to learn first?","a":"New team members need to learn the layout and the picking routine before they handle live orders."},
   {"q":"What don't you have to do that people assume you do?","a":"We don't have to count every SKU daily; we only have to count the high-value A items."},
   {"q":"What must never be ignored in your warehouse?","a":"A damaged-goods report must never be ignored; it has to be investigated the same week."},
   {"q":"What routine keeps your operation steady rather than heroic?","a":"The daily walk-through must happen before eight, and that routine keeps us steady all day."}]}
]

# 269 - Complex sentences (because, so, although)
data["269"] = [
 {"title":"Open cloze — frases complexas (because/so/although) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"___ delays happen, we catch them fast, so the cost stays low.","a":"Although"},
   {"q":"The delivery was late ___ the carrier broke down on the lane.","a":"because"},
   {"q":"The carrier broke down, ___ we switched to the backup immediately.","a":"so"},
   {"q":"___ the port was congested, the shipment still arrived on time.","a":"Although"},
   {"q":"We track every leg ___ a delay at hour one is cheap to fix.","a":"because"},
   {"q":"The lane was blocked, ___ we rerouted through the second hub.","a":"so"},
   {"q":"___ the weather was bad, the trucks kept to schedule.","a":"Although"},
   {"q":"We trust this carrier ___ they always warn us early.","a":"because"},
   {"q":"Fuel costs rose, ___ we renegotiated the freight rates.","a":"so"},
   {"q":"___ the backup carrier is more expensive, it never lets us down.","a":"Although"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"The carrier broke down. The delivery was late.  ·  (BECAUSE)  ·  The delivery was late ___ down.","a":"because the carrier broke"},
   {"q":"The carrier broke down. We used the backup.  ·  (SO)  ·  The carrier broke down, ___ the backup.","a":"so we used"},
   {"q":"The port was congested, but the shipment arrived on time.  ·  (ALTHOUGH)  ·  ___ congested, the shipment arrived on time.","a":"Although the port was"},
   {"q":"Delays happen, yet we catch them fast.  ·  (ALTHOUGH)  ·  ___ , we catch them fast.","a":"Although delays happen"},
   {"q":"Fuel costs rose, and that is why we renegotiated.  ·  (SO)  ·  Fuel costs rose, ___ .","a":"so we renegotiated"},
   {"q":"We trust them. The reason is their early warnings.  ·  (BECAUSE)  ·  We trust them ___ early.","a":"because they warn us"}]},
 {"title":"Multiple-choice cloze — escolha o conector","note":"Marque a opção certa.","items":[
   {"q":"The delivery was late ___ the carrier broke down. (a) so (b) because (c) although","a":"(b) because"},
   {"q":"The lane was blocked, ___ we rerouted. (a) because (b) although (c) so","a":"(c) so"},
   {"q":"___ the weather was bad, the trucks ran on time. (a) Because (b) Although (c) So","a":"(b) Although"},
   {"q":"We track every leg ___ early delays are cheap. (a) because (b) so (c) although","a":"(a) because"},
   {"q":"Fuel rose, ___ we renegotiated the rates. (a) because (b) although (c) so","a":"(c) so"},
   {"q":"___ the backup costs more, it is reliable. (a) So (b) Because (c) Although","a":"(c) Although"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"The delivery was late so the carrier broke down.","a":"The delivery was late because the carrier broke down. (causa → because, não so)"},
   {"q":"Because the lane was blocked, so we rerouted.","a":"Because the lane was blocked, we rerouted. (não se usa because e so juntos)"},
   {"q":"Although the port was congested, but the shipment arrived.","a":"Although the port was congested, the shipment arrived. (although e but não se combinam)"},
   {"q":"We trust them because of they warn us early.","a":"We trust them because they warn us early. (because + oração; because of + substantivo)"},
   {"q":"Fuel rose, because we renegotiated the rates.","a":"Fuel rose, so we renegotiated the rates. (resultado → so, não because)"},
   {"q":"Although the backup costs more, it is reliable so.","a":"Although the backup costs more, it is reliable. (so está sobrando e mal colocado)"}]},
 {"title":"Collocations & vocabulary building — transporte e logística (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to reroute a shipment","a":"redirecionar uma carga"},
   {"q":"a freight forwarder","a":"um agente de carga"},
   {"q":"a carrier","a":"uma transportadora"},
   {"q":"door-to-door delivery","a":"entrega porta a porta"},
   {"q":"to consolidate loads","a":"consolidar cargas"},
   {"q":"transit time","a":"tempo de trânsito"},
   {"q":"a demurrage charge","a":"uma sobreestadia (demurrage)"},
   {"q":"last-mile delivery","a":"entrega de última milha"},
   {"q":"to track a consignment","a":"rastrear uma remessa"},
   {"q":"a haulage rate","a":"uma tarifa de transporte rodoviário"}]},
 {"title":"Fale sobre você / Discuss — frases complexas no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"Why do you track shipments leg by leg?","a":"I track shipments leg by leg because a delay caught at hour one is much cheaper to fix."},
   {"q":"What did you do recently when a carrier failed?","a":"Our carrier broke down, so we switched to the backup lane and the order still arrived on time."},
   {"q":"Tell me about a time things went well despite a problem.","a":"Although the port was congested, we rerouted early, so the shipment reached the customer on schedule."},
   {"q":"Why do you keep a backup carrier even though it costs more?","a":"I keep a backup because it never lets us down, although it is more expensive than the main one."},
   {"q":"How do you explain a delay to a customer?","a":"I tell them the delivery slipped because of a breakdown, so we have already arranged a faster reroute."},
   {"q":"What contrast surprises people about your operation?","a":"Although delays happen often, we rarely miss a deadline, because we catch problems very early."}]}
]

# 270 - Passive voice in procedures
data["270"] = [
 {"title":"Open cloze — voz passiva em procedimentos (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"The order ___ received, checked and dispatched within the day.","a":"is"},
   {"q":"The items ___ picked, packed and labelled before noon.","a":"are"},
   {"q":"The parcel is ___ to the customer within 48 hours.","a":"delivered / dispatched"},
   {"q":"Every exception ___ logged and reviewed at the daily stand-up.","a":"is"},
   {"q":"The box ___ sealed once the contents are verified.","a":"is"},
   {"q":"Orders ___ checked for errors before they are released.","a":"are"},
   {"q":"The promise date is ___ at the moment the order is placed.","a":"set / fixed / confirmed"},
   {"q":"Complaints ___ traced back to the step where the mistake began.","a":"are"},
   {"q":"First-time accuracy is ___ on the dashboard every morning.","a":"shown / tracked / measured"},
   {"q":"The cycle time ___ measured from order to delivery.","a":"is"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"We receive the order and check it.  ·  (CHECKED)  ·  The order is received and ___ .","a":"checked"},
   {"q":"Staff pick and pack the items.  ·  (PACKED)  ·  The items are picked and ___ .","a":"packed"},
   {"q":"The courier delivers the parcel in two days.  ·  (DELIVERED)  ·  The parcel ___ in two days.","a":"is delivered"},
   {"q":"We log every exception.  ·  (LOGGED)  ·  Every exception ___ .","a":"is logged"},
   {"q":"They verify the contents, then seal the box.  ·  (SEALED)  ·  Once verified, the box ___ .","a":"is sealed"},
   {"q":"We measure the cycle time from order to delivery.  ·  (MEASURED)  ·  The cycle time ___ from order to delivery.","a":"is measured"}]},
 {"title":"Multiple-choice cloze — escolha a forma passiva","note":"Marque a opção certa.","items":[
   {"q":"The order ___ within the day. (a) is dispatched (b) dispatches (c) dispatching","a":"(a) is dispatched"},
   {"q":"The items ___ before noon. (a) is packed (b) are packed (c) pack","a":"(b) are packed"},
   {"q":"Every exception ___ at the stand-up. (a) reviews (b) is reviewed (c) reviewing","a":"(b) is reviewed"},
   {"q":"The box ___ once the contents are checked. (a) seals (b) is sealed (c) sealing","a":"(b) is sealed"},
   {"q":"Complaints ___ to the original step. (a) are traced (b) traces (c) is traced","a":"(a) are traced"},
   {"q":"The cycle time ___ from order to delivery. (a) measure (b) is measured (c) measuring","a":"(b) is measured"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"The order is dispatch within the day.","a":"The order is dispatched within the day. (passiva: be + particípio, dispatched)"},
   {"q":"The items is picked and packed.","a":"The items are picked and packed. (sujeito plural → are)"},
   {"q":"Every exception are logged at the stand-up.","a":"Every exception is logged at the stand-up. (every + singular → is)"},
   {"q":"The box sealed once the contents are verified.","a":"The box is sealed once the contents are verified. (falta o auxiliar is)"},
   {"q":"Complaints is traced to the original step.","a":"Complaints are traced to the original step. (sujeito plural → are)"},
   {"q":"The cycle time is measure from order to delivery.","a":"The cycle time is measured from order to delivery. (particípio: measured)"}]},
 {"title":"Collocations & vocabulary building — fulfilment (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"order cycle time","a":"tempo de ciclo do pedido"},
   {"q":"a perfect order","a":"um pedido perfeito (sem erros)"},
   {"q":"to ship complete","a":"despachar completo"},
   {"q":"to meet the promise date","a":"cumprir a data prometida"},
   {"q":"a short shipment","a":"uma remessa incompleta"},
   {"q":"to handle an exception","a":"tratar uma exceção"},
   {"q":"on-time in full (OTIF)","a":"no prazo e completo"},
   {"q":"to dispatch an order","a":"despachar um pedido"},
   {"q":"a returns process","a":"um processo de devoluções"},
   {"q":"to chase a backorder","a":"cobrar um pedido pendente"}]},
 {"title":"Fale sobre você / Discuss — voz passiva no seu fulfilment","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"How is an order fulfilled in your operation?","a":"The order is received, the items are picked and packed, and the parcel is dispatched the same day."},
   {"q":"What is measured to judge fulfilment quality?","a":"Order cycle time, first-time accuracy and the exception rate are tracked on the dashboard every day."},
   {"q":"How are exceptions handled?","a":"Each exception is logged, reviewed at the stand-up and traced back to the step where it began."},
   {"q":"What is checked before an order is released?","a":"Every order is checked for errors and the contents are verified before the box is sealed."},
   {"q":"How is the promise date set?","a":"The promise date is fixed the moment the order is placed, and then it is monitored obsessively."},
   {"q":"What part of the procedure would you improve?","a":"I would improve the check step, because most complaints are traced back to errors that are missed there."}]}
]

# 271 - Modals of uncertainty (might, may, could)
data["271"] = [
 {"title":"Open cloze — modais de incerteza (might/may/could) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"Demand ___ rise by five to ten per cent next quarter.","a":"might / may / could"},
   {"q":"Prices ___ fluctuate if the harvest disappoints.","a":"may / might / could"},
   {"q":"The supplier ___ deliver early, or they could be late — it is uncertain.","a":"might / may / could"},
   {"q":"We ___ see a dip in Q3, but the data is not clear yet.","a":"might / may / could"},
   {"q":"It could ___ either way, so we are planning for a range.","a":"go"},
   {"q":"Seasonality ___ explain part of the spike we are seeing.","a":"may / might / could"},
   {"q":"The baseline ___ be too optimistic for a volatile market.","a":"might / may / could"},
   {"q":"Output ___ not recover before the new crop arrives.","a":"may / might"},
   {"q":"There ___ be a shortage if reorders keep climbing.","a":"might / may / could"},
   {"q":"We can't be sure, but the trend ___ continue into next month.","a":"might / may / could"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"Perhaps demand will rise next quarter.  ·  (MIGHT)  ·  Demand ___ next quarter.","a":"might rise"},
   {"q":"It is possible that prices will fluctuate.  ·  (MAY)  ·  Prices ___ .","a":"may fluctuate"},
   {"q":"There are two possible outcomes for the supplier.  ·  (COULD)  ·  The supplier ___ early or late.","a":"could deliver / could arrive"},
   {"q":"Maybe we will see a dip in Q3.  ·  (MIGHT)  ·  We ___ a dip in Q3.","a":"might see"},
   {"q":"It is possible that output will not recover.  ·  (MAY)  ·  Output ___ .","a":"may not recover"},
   {"q":"Perhaps seasonality explains the spike.  ·  (COULD)  ·  Seasonality ___ the spike.","a":"could explain"}]},
 {"title":"Multiple-choice cloze — escolha o modal correto","note":"Marque a opção certa.","items":[
   {"q":"Demand ___ rise by ten per cent. (a) might (b) must (c) should","a":"(a) might"},
   {"q":"Prices ___ fluctuate this season. (a) may (b) have to (c) ought","a":"(a) may"},
   {"q":"The supplier ___ deliver early or late. (a) could (b) need (c) had to","a":"(a) could"},
   {"q":"Output ___ not recover before the new crop. (a) may (b) must (c) had to","a":"(a) may"},
   {"q":"It ___ go either way, honestly. (a) could (b) must (c) needs","a":"(a) could"},
   {"q":"There ___ be a shortage if reorders climb. (a) might (b) must (c) have to","a":"(a) might"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"Demand might to rise next quarter.","a":"Demand might rise next quarter. (might + base, sem to)"},
   {"q":"Prices may fluctuates this season.","a":"Prices may fluctuate this season. (modal + base, sem -s)"},
   {"q":"The supplier could delivered early.","a":"The supplier could deliver early. (could + base, deliver)"},
   {"q":"Output may not to recover this year.","a":"Output may not recover this year. (may not + base, sem to)"},
   {"q":"It could goes either way.","a":"It could go either way. (could + base, go)"},
   {"q":"There might be a shortage, isn't it?","a":"There might be a shortage, mightn't there? / ...couldn't there? (question tag concorda com o modal)"}]},
 {"title":"Collocations & vocabulary building — previsão de demanda (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"a demand forecast","a":"uma previsão de demanda"},
   {"q":"a forecast range","a":"uma faixa de previsão"},
   {"q":"to factor in seasonality","a":"considerar a sazonalidade"},
   {"q":"a best-case scenario","a":"um cenário otimista"},
   {"q":"a worst-case scenario","a":"um cenário pessimista"},
   {"q":"forecast error","a":"erro de previsão"},
   {"q":"to second-guess the data","a":"questionar/duvidar dos dados"},
   {"q":"a rolling forecast","a":"uma previsão contínua/móvel"},
   {"q":"to hedge against uncertainty","a":"proteger-se contra a incerteza"},
   {"q":"a confidence interval","a":"um intervalo de confiança"}]},
 {"title":"Fale sobre você / Discuss — modais de incerteza no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"How might demand change in your business next quarter?","a":"Demand might rise slightly, but it could also dip if the promotion ends, so we plan for a range."},
   {"q":"What may go wrong with your current forecast?","a":"The baseline may be too optimistic, and seasonality could hide the real underlying trend."},
   {"q":"How do you present uncertainty to your stakeholders?","a":"I give a range and say the figure might move five per cent either way, rather than a single number."},
   {"q":"What could a supplier do that you can't fully predict?","a":"A supplier could deliver early or run late, so we keep a small buffer to cover both possibilities."},
   {"q":"What might happen if reorders keep climbing?","a":"If reorders keep climbing, there might be a shortage, so we may need to raise our safety stock."},
   {"q":"Where could your forecast be most wrong, and why?","a":"My forecast could be most wrong on new products, because we may have very little history to rely on."}]}
]

# 272 - Parallel structure
data["272"] = [
 {"title":"Open cloze — estrutura paralela (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"Each week we move stock, shift capacity and ___ priorities.","a":"change"},
   {"q":"Our job is planning, scheduling and ___ the daily flow.","a":"monitoring / controlling"},
   {"q":"We aim to be fast, accurate and ___ .","a":"reliable / consistent"},
   {"q":"The plan tells us what to make, when to ship and where to ___ it.","a":"store / deliver / send"},
   {"q":"They reallocated people, rebalanced lines and ___ the schedule.","a":"changed / adjusted / reset"},
   {"q":"We measure cost, speed and ___ every week.","a":"quality / service / accuracy"},
   {"q":"The review covers supply, demand and ___ .","a":"capacity / alignment"},
   {"q":"Good alignment means less idle time, fewer complaints and ___ working capital.","a":"lower / less"},
   {"q":"We are cutting waste, raising service and ___ costs.","a":"reducing / cutting / lowering"},
   {"q":"The goal is to plan early, act fast and ___ calm.","a":"stay / remain"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"We move stock. We shift capacity. We change priorities.  ·  (AND)  ·  We move stock, shift capacity ___ priorities.","a":"and change"},
   {"q":"Our job involves planning, scheduling, and we also monitor the flow.  ·  (MONITORING)  ·  Our job involves planning, scheduling and ___ the flow.","a":"monitoring"},
   {"q":"The plan covers what to make and the timing of shipping.  ·  (WHEN)  ·  The plan covers what to make and ___ ship.","a":"when to"},
   {"q":"We want speed, accuracy, and to be reliable.  ·  (RELIABILITY)  ·  We want speed, accuracy and ___ .","a":"reliability"},
   {"q":"They reallocated people and the schedule was changed too.  ·  (CHANGED)  ·  They reallocated people and ___ the schedule.","a":"changed"},
   {"q":"The goal is planning early and to act fast.  ·  (ACTING)  ·  The goal is planning early and ___ fast.","a":"acting"}]},
 {"title":"Multiple-choice cloze — escolha a forma paralela","note":"Marque a opção certa.","items":[
   {"q":"We move stock, shift capacity and ___ priorities. (a) changing (b) change (c) to change","a":"(b) change"},
   {"q":"Our job is planning, scheduling and ___ the flow. (a) monitor (b) to monitor (c) monitoring","a":"(c) monitoring"},
   {"q":"We aim to be fast, accurate and ___ . (a) reliably (b) reliable (c) reliability","a":"(b) reliable"},
   {"q":"The plan says what to make and when to ___ . (a) shipping (b) ship (c) shipped","a":"(b) ship"},
   {"q":"We are cutting waste, raising service and ___ costs. (a) lowered (b) to lower (c) lowering","a":"(c) lowering"},
   {"q":"The goal is to plan early, act fast and ___ calm. (a) staying (b) stay (c) stayed","a":"(b) stay"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"We move stock, shifting capacity and change priorities.","a":"We move stock, shift capacity and change priorities. (manter a mesma forma verbal em paralelo)"},
   {"q":"Our job is planning, scheduling and to monitor the flow.","a":"Our job is planning, scheduling and monitoring the flow. (lista em -ing → monitoring)"},
   {"q":"We aim to be fast, accurate and reliability.","a":"We aim to be fast, accurate and reliable. (lista de adjetivos → reliable)"},
   {"q":"The plan covers what to make, the timing and where to ship.","a":"The plan covers what to make, when to ship and where to ship. (manter o padrão 'what/when/where to + verbo')"},
   {"q":"We are cutting waste, raising service and costs are lowered.","a":"We are cutting waste, raising service and lowering costs. (manter o padrão -ing)"},
   {"q":"The goal is to plan early, acting fast and stay calm.","a":"The goal is to plan early, act fast and stay calm. (manter o infinitivo sem to em paralelo)"}]},
 {"title":"Collocations & vocabulary building — alinhar oferta e demanda (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to balance supply and demand","a":"equilibrar oferta e demanda"},
   {"q":"to free up capacity","a":"liberar capacidade"},
   {"q":"to smooth the workload","a":"nivelar a carga de trabalho"},
   {"q":"a capacity constraint","a":"uma restrição de capacidade"},
   {"q":"to reallocate resources","a":"realocar recursos"},
   {"q":"to flatten the peaks","a":"reduzir os picos"},
   {"q":"idle capacity","a":"capacidade ociosa"},
   {"q":"to hit a steady rhythm","a":"atingir um ritmo constante"},
   {"q":"a weekly cadence","a":"uma cadência semanal"},
   {"q":"to keep things in step","a":"manter tudo sincronizado"}]},
 {"title":"Fale sobre você / Discuss — estrutura paralela no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"In one sentence, what are your three main weekly tasks?","a":"Each week I plan the supply, adjust the schedule and review the service level with the team."},
   {"q":"What three things does good alignment deliver in your operation?","a":"Good alignment delivers fewer stockouts, lower working capital and happier customers."},
   {"q":"What do you do when supply and demand drift apart?","a":"I move stock, shift capacity and change priorities until the two are back in step."},
   {"q":"Describe your team's goal using a clean list.","a":"Our goal is to plan early, act fast and stay calm under pressure."},
   {"q":"What three metrics do you track every week?","a":"Every week I track cost, speed and accuracy, and I report all three in the same format."},
   {"q":"What three actions improve your weekly rhythm?","a":"To improve our rhythm, we smooth the workload, free up capacity and flatten the peaks."}]}
]

# 273 - Complex noun phrases
data["273"] = [
 {"title":"Open cloze — sintagmas nominais complexos (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"We need a refreshed cross-functional ___ before the S&OP meeting.","a":"forecast"},
   {"q":"They prepared a pre-aligned financial ___ for each option.","a":"scenario"},
   {"q":"The team agreed on a clear service-cost ___ .","a":"trade-off"},
   {"q":"We reviewed the updated monthly ___ plan.","a":"capacity"},
   {"q":"It is a high-priority supplier risk ___ .","a":"register / review"},
   {"q":"The deck includes a one-page demand ___ summary.","a":"forecast / planning"},
   {"q":"We built a fully costed best-case ___ .","a":"scenario"},
   {"q":"She owns the end-to-end order ___ process.","a":"fulfilment"},
   {"q":"This is a well-rehearsed crisis ___ plan.","a":"response"},
   {"q":"They signed off a long-term strategic sourcing ___ .","a":"agreement / plan"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"a forecast that is refreshed every month  ·  (REFRESHED)  ·  a ___ forecast","a":"refreshed monthly"},
   {"q":"a scenario that is aligned with finance  ·  (FINANCIAL)  ·  a pre-aligned ___ scenario","a":"financial"},
   {"q":"a review of capacity carried out each month  ·  (MONTHLY)  ·  a ___ capacity review","a":"monthly"},
   {"q":"a trade-off between service and cost  ·  (SERVICE-COST)  ·  a ___ trade-off","a":"service-cost"},
   {"q":"a plan for responding to a crisis  ·  (CRISIS)  ·  a ___ plan","a":"crisis response"},
   {"q":"a process that handles orders from end to end  ·  (END-TO-END)  ·  an ___ order process","a":"end-to-end"}]},
 {"title":"Multiple-choice cloze — ordem dos modificadores","note":"Marque a opção certa.","items":[
   {"q":"We need a ___ forecast for the meeting. (a) cross-functional refreshed (b) refreshed cross-functional (c) refreshed functional cross","a":"(b) refreshed cross-functional"},
   {"q":"They built a ___ scenario. (a) financial pre-aligned (b) pre-aligned financial (c) aligned-pre financial","a":"(b) pre-aligned financial"},
   {"q":"It is a ___ review. (a) monthly updated capacity (b) capacity monthly updated (c) updated capacity monthly","a":"(a) monthly updated capacity"},
   {"q":"We agreed a ___ trade-off. (a) cost-service clear (b) clear service-cost (c) service clear-cost","a":"(b) clear service-cost"},
   {"q":"She owns the ___ process. (a) order end-to-end (b) end-to-end order (c) end order-to-end","a":"(b) end-to-end order"},
   {"q":"This is a ___ plan. (a) response crisis rehearsed (b) well-rehearsed crisis response (c) crisis well-rehearsed response","a":"(b) well-rehearsed crisis response"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"We need a forecast cross-functional refreshed.","a":"We need a refreshed cross-functional forecast. (modificadores vêm antes do substantivo, na ordem certa)"},
   {"q":"They built a scenario financial pre-aligned.","a":"They built a pre-aligned financial scenario. (em inglês os adjetivos ficam antes do substantivo)"},
   {"q":"It is a review of capacity monthly.","a":"It is a monthly capacity review. (compactar como sintagma nominal: monthly capacity review)"},
   {"q":"We agreed a trade-off of service and cost clear.","a":"We agreed a clear service-cost trade-off. (empilhar modificadores antes do núcleo)"},
   {"q":"She owns the process order end-to-end.","a":"She owns the end-to-end order process. (modificadores antes do substantivo process)"},
   {"q":"This is a plan crisis response well-rehearsed.","a":"This is a well-rehearsed crisis response plan. (ordem: modificadores + núcleo plan)"}]},
 {"title":"Collocations & vocabulary building — processo S&OP (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"a cross-functional team","a":"uma equipe multifuncional"},
   {"q":"a consensus forecast","a":"uma previsão de consenso"},
   {"q":"a demand plan","a":"um plano de demanda"},
   {"q":"a supply plan","a":"um plano de suprimento"},
   {"q":"an executive review","a":"uma revisão executiva"},
   {"q":"a what-if scenario","a":"um cenário hipotético"},
   {"q":"a decision log","a":"um registro de decisões"},
   {"q":"a gap analysis","a":"uma análise de lacunas"},
   {"q":"a planning horizon","a":"um horizonte de planejamento"},
   {"q":"a sign-off meeting","a":"uma reunião de aprovação"}]},
 {"title":"Fale sobre você / Discuss — sintagmas nominais complexos no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What documents do you prepare before an S&OP meeting?","a":"I prepare a refreshed cross-functional forecast and a pre-aligned financial scenario for each option."},
   {"q":"How would you describe your monthly review in three or four words?","a":"It is a disciplined monthly capacity review that ends with clear, signed-off decisions."},
   {"q":"What trade-off do you face most often?","a":"I face a constant service-cost trade-off, so every plan has to balance reliability against expense."},
   {"q":"Who owns the end-to-end process in your area?","a":"I own the end-to-end order fulfilment process, from receipt to final delivery."},
   {"q":"Describe a plan you rely on in a crisis.","a":"We rely on a well-rehearsed crisis response plan that names an owner for each major risk."},
   {"q":"What kind of forecast does your team trust most?","a":"My team trusts a consensus demand forecast that is refreshed every month with real data."}]}
]

# 274 - Expressions of reduction (by, down to)
data["274"] = [
 {"title":"Open cloze — expressões de redução (by / down to) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"We cut the cycle time ___ twenty per cent last quarter.","a":"by"},
   {"q":"We cut the cycle time down ___ eighteen hours.","a":"to"},
   {"q":"Lead time fell ___ seven days after the redesign.","a":"by"},
   {"q":"We brought the lead time down ___ fourteen days.","a":"to"},
   {"q":"Variability dropped ___ half once we standardised the route.","a":"by"},
   {"q":"The 95th percentile came down ___ thirty hours.","a":"to"},
   {"q":"We shaved ___ two days off the worst-case lead time.","a":"off"},
   {"q":"Costs were reduced ___ around fifteen per cent.","a":"by"},
   {"q":"We trimmed the queue time down ___ under an hour.","a":"to"},
   {"q":"Defects fell ___ a third after the new check.","a":"by"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"The cycle time was 24 hours; now it is 18.  ·  (DOWN TO)  ·  We cut the cycle time ___ 18 hours.","a":"down to"},
   {"q":"The improvement in cycle time was 20%.  ·  (BY)  ·  We cut the cycle time ___ .","a":"by 20%"},
   {"q":"Lead time was 21 days; now it is 14.  ·  (DOWN TO)  ·  We brought lead time ___ 14 days.","a":"down to"},
   {"q":"We removed two days from the lead time.  ·  (SHAVED)  ·  We ___ the lead time.","a":"shaved two days off"},
   {"q":"Variability is now half what it was.  ·  (BY)  ·  Variability fell ___ .","a":"by half"},
   {"q":"The worst case is now 30 hours.  ·  (DOWN TO)  ·  We got the worst case ___ 30 hours.","a":"down to"}]},
 {"title":"Multiple-choice cloze — escolha by ou down to","note":"Marque a opção certa.","items":[
   {"q":"We cut the cycle time ___ 20%. (a) down to (b) by (c) at","a":"(b) by"},
   {"q":"We cut the cycle time ___ 18 hours. (a) by (b) down to (c) of","a":"(b) down to"},
   {"q":"Lead time fell ___ seven days. (a) by (b) down to (c) on","a":"(a) by"},
   {"q":"We brought it ___ 14 days. (a) by (b) down to (c) off","a":"(b) down to"},
   {"q":"Costs dropped ___ a third. (a) down to (b) by (c) in","a":"(b) by"},
   {"q":"We trimmed queue time ___ under an hour. (a) by (b) down to (c) at","a":"(b) down to"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"We cut the cycle time down 20%.","a":"We cut the cycle time by 20%. (quantidade da mudança → by)"},
   {"q":"We brought lead time by 14 days as the new level.","a":"We brought lead time down to 14 days. (novo nível atingido → down to)"},
   {"q":"Variability fell down to half.","a":"Variability fell by half. (proporção da queda → by half)"},
   {"q":"We shaved two days of the lead time.","a":"We shaved two days off the lead time. (colocação correta: shave off)"},
   {"q":"Costs were reduced down 15%.","a":"Costs were reduced by 15%. (montante da redução → by)"},
   {"q":"The worst case came down at 30 hours.","a":"The worst case came down to 30 hours. (novo nível → down to)"}]},
 {"title":"Collocations & vocabulary building — lead time e ciclos (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"lead time","a":"prazo de entrega/atendimento"},
   {"q":"cycle time","a":"tempo de ciclo"},
   {"q":"to cut lead time","a":"reduzir o lead time"},
   {"q":"queue time","a":"tempo de fila/espera"},
   {"q":"to streamline a process","a":"enxugar/simplificar um processo"},
   {"q":"a bottleneck","a":"um gargalo"},
   {"q":"throughput","a":"vazão/processamento"},
   {"q":"the long tail (of a distribution)","a":"a cauda longa (da distribuição)"},
   {"q":"to bring something forward","a":"antecipar algo"},
   {"q":"to tighten the variation","a":"reduzir a variação"}]},
 {"title":"Fale sobre você / Discuss — expressões de redução no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What have you reduced recently, and by how much?","a":"We cut our order cycle time by about twenty per cent over the last two quarters."},
   {"q":"What new level did a key metric reach after your change?","a":"We brought the lead time down to fourteen days, which is the best level we have ever had."},
   {"q":"Where do you attack variation rather than the average?","a":"I attack the worst case, so I look at the 95th percentile and try to shave days off the long tail."},
   {"q":"What is your next reduction target?","a":"Next, I want to cut queue time by half and bring it down to under an hour at the busiest gate."},
   {"q":"How do you measure whether a process is improving?","a":"I track the full distribution, not just the average, and report changes both by amount and down to a level."},
   {"q":"What was the impact of your last efficiency project?","a":"The project reduced costs by fifteen per cent and brought the cycle time down to a single shift."}]}
]

# 275 - Reporting verbs (show, indicate, suggest)
data["275"] = [
 {"title":"Open cloze — verbos de reporte (show/indicate/suggest) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"The numbers ___ that OTIF has fallen this month.","a":"show / indicate / suggest"},
   {"q":"The trend ___ a supplier problem upstream.","a":"indicates / suggests / shows"},
   {"q":"The figures ___ that we should act this week.","a":"suggest / indicate"},
   {"q":"The dashboard ___ a clear drop in first-time accuracy.","a":"shows"},
   {"q":"The data suggests ___ the issue is structural, not seasonal.","a":"that"},
   {"q":"The chart ___ a steady decline over six weeks.","a":"shows / indicates"},
   {"q":"These results ___ that the new process is working.","a":"suggest / indicate / show"},
   {"q":"The KPI review ___ where the real problem sits.","a":"shows / indicates"},
   {"q":"The variance ___ that the forecast was too optimistic.","a":"suggests / indicates"},
   {"q":"The report ___ a clear link between delays and complaints.","a":"shows / indicates"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"The numbers make it clear that OTIF fell.  ·  (SHOW)  ·  The numbers ___ OTIF fell.","a":"show that"},
   {"q":"There is a strong pattern of a supplier problem.  ·  (INDICATE)  ·  The trend ___ a supplier problem.","a":"indicates"},
   {"q":"My interpretation is that we should act now.  ·  (SUGGEST)  ·  The figures ___ we should act now.","a":"suggest that"},
   {"q":"The dashboard makes the drop obvious.  ·  (SHOWS)  ·  The dashboard ___ a clear drop.","a":"shows"},
   {"q":"I recommend that we recheck the data.  ·  (SUGGEST)  ·  I ___ rechecking the data.","a":"suggest"},
   {"q":"The variance is evidence of an optimistic forecast.  ·  (INDICATES)  ·  The variance ___ an optimistic forecast.","a":"indicates"}]},
 {"title":"Multiple-choice cloze — escolha o verbo de reporte","note":"Marque a opção certa.","items":[
   {"q":"The numbers ___ that OTIF has fallen. (a) say (b) show (c) tell","a":"(b) show"},
   {"q":"The trend ___ a supplier problem. (a) indicates (b) indicate (c) indicating","a":"(a) indicates"},
   {"q":"The figures ___ we act this week. (a) suggest (b) suggests to (c) suggesting","a":"(a) suggest"},
   {"q":"The data suggests ___ the issue is structural. (a) to (b) that (c) for","a":"(b) that"},
   {"q":"I suggest ___ the data first. (a) to recheck (b) rechecking (c) recheck","a":"(b) rechecking"},
   {"q":"The chart ___ a steady decline. (a) show (b) shows (c) showing","a":"(b) shows"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"The numbers says that OTIF has fallen.","a":"The numbers show that OTIF has fallen. (sujeito plural; em registro formal use show, não say)"},
   {"q":"The trend indicate a supplier problem.","a":"The trend indicates a supplier problem. (3ª pessoa singular → indicates)"},
   {"q":"The figures suggest to act this week.","a":"The figures suggest that we act this week. (suggest + that-clause, não suggest to)"},
   {"q":"I suggest to recheck the data.","a":"I suggest rechecking the data. (suggest + -ing, não suggest to)"},
   {"q":"The data suggest the issue is structural.","a":"The data suggests the issue is structural. (data como bloco singular aqui → suggests)"},
   {"q":"The chart show a steady decline.","a":"The chart shows a steady decline. (3ª pessoa singular → shows)"}]},
 {"title":"Collocations & vocabulary building — KPIs (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to hit a target","a":"bater uma meta"},
   {"q":"to miss a target","a":"não atingir uma meta"},
   {"q":"a leading indicator","a":"um indicador antecedente"},
   {"q":"a lagging indicator","a":"um indicador defasado"},
   {"q":"a benchmark","a":"uma referência/parâmetro"},
   {"q":"to drill down into the data","a":"detalhar/aprofundar os dados"},
   {"q":"a downward trend","a":"uma tendência de queda"},
   {"q":"an outlier","a":"um ponto fora da curva"},
   {"q":"to flag an anomaly","a":"sinalizar uma anomalia"},
   {"q":"a dashboard view","a":"uma visão de painel"}]},
 {"title":"Fale sobre você / Discuss — verbos de reporte no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What do your latest numbers show?","a":"The numbers show that our on-time delivery dipped slightly, mainly because of one carrier."},
   {"q":"What does a recent trend indicate in your operation?","a":"The trend indicates a supplier problem upstream, so we are reviewing that vendor this week."},
   {"q":"Based on the data, what do you suggest your team should do?","a":"The figures suggest that we should act now, so I suggest tightening the daily review."},
   {"q":"How do you keep your KPI review disciplined?","a":"I keep it to a fixed rhythm and use clean data, so the numbers show the truth, not an illusion."},
   {"q":"When did the data point you to a problem you had missed?","a":"Last month the variance indicated an over-optimistic forecast that I had not noticed before."},
   {"q":"How do you turn a KPI review into real decisions?","a":"I present what the data shows, say what it indicates, and then suggest one concrete action."}]}
]

# 276 - Reported speech (past)
data["276"] = [
 {"title":"Open cloze — discurso indireto (passado) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"\"The port is closed.\" → He said the port ___ closed.","a":"was"},
   {"q":"\"We are loading now.\" → She said they ___ loading.","a":"were"},
   {"q":"\"The shipment will arrive on Monday.\" → He said the shipment ___ arrive on Monday.","a":"would"},
   {"q":"\"We can't reach the supplier.\" → They said they ___ reach the supplier.","a":"couldn't / could not"},
   {"q":"\"Stock has run out.\" → He said stock ___ run out.","a":"had"},
   {"q":"\"The team is on strike.\" → She ___ us the team was on strike.","a":"told"},
   {"q":"\"Prices are rising.\" → He said prices ___ rising.","a":"were"},
   {"q":"\"We delivered the order.\" → They said they ___ delivered the order.","a":"had"},
   {"q":"\"I will call you back.\" → She said she ___ call me back.","a":"would"},
   {"q":"\"The plant must close for Tet.\" → He said the plant ___ close for Tet.","a":"had to"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"\"The port is closed,\" he said.  ·  (SAID)  ·  He ___ closed.","a":"said the port was"},
   {"q":"\"We will ship on Monday,\" she said.  ·  (WOULD)  ·  She said they ___ on Monday.","a":"would ship"},
   {"q":"\"We can't reach the supplier,\" they said.  ·  (COULD)  ·  They said they ___ the supplier.","a":"couldn't reach"},
   {"q":"\"Stock has run out,\" he told me.  ·  (HAD)  ·  He told me stock ___ out.","a":"had run"},
   {"q":"\"The team is on strike,\" she said.  ·  (TOLD)  ·  She ___ the team was on strike.","a":"told us / told me"},
   {"q":"\"Prices are rising,\" he warned.  ·  (WERE)  ·  He warned that prices ___ .","a":"were rising"}]},
 {"title":"Multiple-choice cloze — discurso indireto","note":"Marque a opção certa.","items":[
   {"q":"He said the port ___ closed. (a) is (b) was (c) will be","a":"(b) was"},
   {"q":"She said they ___ loading the container. (a) are (b) were (c) will be","a":"(b) were"},
   {"q":"He said the shipment ___ arrive on Monday. (a) will (b) would (c) is going","a":"(b) would"},
   {"q":"They said they ___ reach the supplier. (a) can't (b) couldn't (c) won't","a":"(b) couldn't"},
   {"q":"He said stock ___ run out. (a) has (b) had (c) have","a":"(b) had"},
   {"q":"She ___ us the team was on strike. (a) said (b) told (c) spoke","a":"(b) told"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"He said the port is closed.","a":"He said the port was closed. (reported speech no passado → recua o tempo: is → was)"},
   {"q":"She said me the team was on strike.","a":"She told me the team was on strike. (tell + objeto; say não leva objeto direto assim)"},
   {"q":"He said the shipment will arrive on Monday.","a":"He said the shipment would arrive on Monday. (will → would)"},
   {"q":"They said they can't reach the supplier.","a":"They said they couldn't reach the supplier. (can → could)"},
   {"q":"He told that stock had run out.","a":"He said that stock had run out. / He told us that stock had run out. (tell precisa de objeto)"},
   {"q":"She said prices are rising.","a":"She said prices were rising. (present continuous → past continuous)"}]},
 {"title":"Collocations & vocabulary building — cadeia global (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to relay an update","a":"repassar uma atualização"},
   {"q":"a handover note","a":"uma nota de passagem de turno"},
   {"q":"follow-the-sun coverage","a":"cobertura 24h entre fusos"},
   {"q":"to bridge time zones","a":"conciliar fusos horários"},
   {"q":"a status report","a":"um relatório de status"},
   {"q":"to loop someone in","a":"incluir alguém na conversa"},
   {"q":"to escalate an issue","a":"escalar um problema"},
   {"q":"a regional hub","a":"um polo regional"},
   {"q":"to align across regions","a":"alinhar entre regiões"},
   {"q":"a public holiday shutdown","a":"parada por feriado"}]},
 {"title":"Fale sobre você / Discuss — discurso indireto no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What did a colleague in another region tell you recently?","a":"My colleague in Asia told me that the port was closed and that the shipment would be delayed."},
   {"q":"What did your supplier say about a recent delay?","a":"The supplier said they couldn't load on time because the plant had to close for a holiday."},
   {"q":"How do you pass on bad news from one shift to the next?","a":"I write a handover note and say what had happened, what was still open and who would act next."},
   {"q":"What did your manager say the team should focus on?","a":"My manager said the team should standardise the templates so updates were easier to read."},
   {"q":"Tell me about a misunderstanding caused by an unclear message.","a":"A colleague said the order was ready, but he meant it would be ready, so we shipped a day late."},
   {"q":"How do you keep updates coherent across time zones?","a":"I report what each region said using the same template, so nothing is lost when work is passed on."}]}
]

# 277 - Second conditional (would) - Incoterms
data["277"] = [
 {"title":"Open cloze — segundo condicional (Incoterms) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"If I used EXW here, the buyer ___ carry all the port work.","a":"would"},
   {"q":"If we ___ DDP, we would take the risk right to the buyer's door.","a":"chose / used / offered"},
   {"q":"If the buyer ___ more experienced, I would offer FOB.","a":"were / was"},
   {"q":"I ___ pick CIF if the buyer wanted the insurance included.","a":"would"},
   {"q":"If I ___ in their position, I would never accept EXW.","a":"were / was"},
   {"q":"We would transfer the risk earlier if we ___ a trusted local agent.","a":"had"},
   {"q":"If the lane ___ riskier, I would add insurance to the terms.","a":"were / was"},
   {"q":"The buyer ___ hold the problem if we shipped EXW.","a":"would"},
   {"q":"If we ___ DAP, the buyer would still clear customs.","a":"used / chose"},
   {"q":"It ___ be safer for them if we quoted CIF instead of FOB.","a":"would"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"I don't use EXW, so the buyer doesn't carry the port work.  ·  (WOULD)  ·  If I used EXW, the buyer ___ the port work.","a":"would carry"},
   {"q":"The buyer isn't experienced, so I won't offer FOB.  ·  (WERE)  ·  If the buyer ___ experienced, I would offer FOB.","a":"were"},
   {"q":"I'm not in their position, so I can't decide.  ·  (WERE)  ·  If I ___ in their position, I would decide.","a":"were"},
   {"q":"We don't have a local agent, so we keep the risk longer.  ·  (HAD)  ·  If we ___ a local agent, we would transfer risk earlier.","a":"had"},
   {"q":"We don't quote CIF, so the insurance isn't included.  ·  (QUOTED)  ·  If we ___ CIF, the insurance would be included.","a":"quoted"},
   {"q":"The lane isn't risky, so I won't add insurance.  ·  (WERE)  ·  If the lane ___ risky, I would add insurance.","a":"were"}]},
 {"title":"Multiple-choice cloze — escolha a forma correta","note":"Marque a opção certa.","items":[
   {"q":"If I used EXW, the buyer ___ all the risk. (a) takes (b) would take (c) will take","a":"(b) would take"},
   {"q":"If the buyer ___ experienced, I'd offer FOB. (a) is (b) were (c) will be","a":"(b) were"},
   {"q":"I ___ pick CIF if they wanted insurance. (a) will (b) would (c) would have","a":"(b) would"},
   {"q":"If I ___ them, I'd refuse EXW. (a) was (b) am (c) were","a":"(c) were"},
   {"q":"It would be safer if we ___ CIF. (a) quote (b) quoted (c) will quote","a":"(b) quoted"},
   {"q":"If we used DDP, we ___ the risk to their door. (a) would carry (b) carry (c) carried","a":"(a) would carry"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"If I used EXW, the buyer will carry all the risk.","a":"If I used EXW, the buyer would carry all the risk. (resultado irreal → would)"},
   {"q":"If we would use DDP, we would take the risk to their door.","a":"If we used DDP, we would take the risk to their door. (if-clause → past simple, não would)"},
   {"q":"If I was them, I would refuse EXW.","a":"If I were them, I would refuse EXW. (em registro formal, condicional irreal → were)"},
   {"q":"It would be safer if we will quote CIF.","a":"It would be safer if we quoted CIF. (if-clause → past simple)"},
   {"q":"If the buyer were experienced, I will offer FOB.","a":"If the buyer were experienced, I would offer FOB. (resultado → would)"},
   {"q":"If we had a local agent, we transferred the risk earlier.","a":"If we had a local agent, we would transfer the risk earlier. (resultado → would + base)"}]},
 {"title":"Collocations & vocabulary building — Incoterms e comércio (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to transfer the risk","a":"transferir o risco"},
   {"q":"to clear customs","a":"liberar na alfândega"},
   {"q":"freight on board (FOB)","a":"livre a bordo"},
   {"q":"cost, insurance and freight (CIF)","a":"custo, seguro e frete"},
   {"q":"ex works (EXW)","a":"na fábrica (EXW)"},
   {"q":"delivered duty paid (DDP)","a":"entregue com direitos pagos"},
   {"q":"the point of delivery","a":"o ponto de entrega"},
   {"q":"to bear the cost","a":"arcar com o custo"},
   {"q":"a shipping term","a":"um termo de transporte"},
   {"q":"to take title to goods","a":"assumir a propriedade da mercadoria"}]},
 {"title":"Fale sobre você / Discuss — segundo condicional (Incoterms) no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"If you used EXW on a deal, what would change for the buyer?","a":"If I used EXW, the buyer would carry all the port work and the risk from the factory door."},
   {"q":"If a buyer were inexperienced, which Incoterm would you offer?","a":"If the buyer were inexperienced, I would offer CIF so the risk and insurance stayed with us longer."},
   {"q":"If a lane were risky, how would you protect the shipment?","a":"If a lane were risky, I would add insurance and quote CIF rather than FOB."},
   {"q":"If you were the customer, what terms would you prefer?","a":"If I were the customer, I would prefer DDP, because the seller would handle everything to my door."},
   {"q":"If you had a trusted local agent, how would your terms change?","a":"If I had a trusted local agent, I would transfer the risk earlier and accept FOB more often."},
   {"q":"If you had to defend one Incoterm in a meeting, which would it be?","a":"If I had to defend one, I would choose CIF, because it would balance cost and protection fairly."}]}
]

# 278 - Passive voice with modal verbs
data["278"] = [
 {"title":"Open cloze — passiva com modais (must/should/can be) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"Every risk must ___ scored for likelihood and impact.","a":"be"},
   {"q":"An owner should ___ named for each high risk.","a":"be"},
   {"q":"Responses can ___ rehearsed in conversation before a crisis hits.","a":"be"},
   {"q":"The risk register must ___ updated every week.","a":"be"},
   {"q":"Critical risks should be ___ to a senior owner.","a":"escalated / assigned"},
   {"q":"A backup plan can ___ prepared off the shelf.","a":"be"},
   {"q":"Nothing should ___ improvised during a real crisis.","a":"be"},
   {"q":"Each response must be ___ before it is needed.","a":"rehearsed / agreed / documented"},
   {"q":"The likelihood ___ be reassessed after every incident.","a":"should / must / can"},
   {"q":"Low risks can ___ monitored rather than actioned.","a":"be"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"We must score every risk.  ·  (BE)  ·  Every risk ___ .","a":"must be scored"},
   {"q":"You should name an owner for each risk.  ·  (BE)  ·  An owner ___ for each risk.","a":"should be named"},
   {"q":"We can rehearse the responses in advance.  ·  (BE)  ·  The responses ___ in advance.","a":"can be rehearsed"},
   {"q":"We must update the register weekly.  ·  (BE)  ·  The register ___ weekly.","a":"must be updated"},
   {"q":"Don't improvise anything in a crisis.  ·  (BE)  ·  Nothing ___ in a crisis.","a":"should be improvised"},
   {"q":"You should escalate critical risks quickly.  ·  (BE)  ·  Critical risks ___ quickly.","a":"should be escalated"}]},
 {"title":"Multiple-choice cloze — passiva com modal","note":"Marque a opção certa.","items":[
   {"q":"Every risk ___ scored. (a) must be (b) must (c) must to be","a":"(a) must be"},
   {"q":"An owner ___ named for each risk. (a) should (b) should be (c) should being","a":"(b) should be"},
   {"q":"Responses ___ rehearsed in advance. (a) can be (b) can (c) can to be","a":"(a) can be"},
   {"q":"The register ___ updated weekly. (a) must (b) must be (c) must been","a":"(b) must be"},
   {"q":"Nothing ___ improvised in a crisis. (a) should be (b) should (c) should being","a":"(a) should be"},
   {"q":"Low risks ___ monitored, not actioned. (a) can (b) can be (c) can to be","a":"(b) can be"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"Every risk must scored for likelihood.","a":"Every risk must be scored for likelihood. (passiva com modal → modal + be + particípio)"},
   {"q":"An owner should be name for each risk.","a":"An owner should be named for each risk. (particípio: named)"},
   {"q":"Responses can to be rehearsed in advance.","a":"Responses can be rehearsed in advance. (modal + be, sem to)"},
   {"q":"The register must be update weekly.","a":"The register must be updated weekly. (particípio: updated)"},
   {"q":"Nothing should improvised in a crisis.","a":"Nothing should be improvised in a crisis. (falta be na passiva)"},
   {"q":"Critical risks should be escalate quickly.","a":"Critical risks should be escalated quickly. (particípio: escalated)"}]},
 {"title":"Collocations & vocabulary building — gestão de risco (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"a risk register","a":"um registro de riscos"},
   {"q":"to assess the likelihood","a":"avaliar a probabilidade"},
   {"q":"a mitigation plan","a":"um plano de mitigação"},
   {"q":"a contingency plan","a":"um plano de contingência"},
   {"q":"to flag a risk","a":"sinalizar um risco"},
   {"q":"a single point of failure","a":"um ponto único de falha"},
   {"q":"to stress-test a plan","a":"testar um plano sob pressão"},
   {"q":"risk appetite","a":"apetite de risco"},
   {"q":"to escalate a concern","a":"escalar uma preocupação"},
   {"q":"a worst-case impact","a":"um impacto de pior caso"}]},
 {"title":"Fale sobre você / Discuss — passiva com modais no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What must always be done with a new risk in your operation?","a":"Every new risk must be scored for likelihood and impact and then added to the register."},
   {"q":"How should ownership of a risk be handled?","a":"An owner should be named for each major risk, so the response can be driven by one person."},
   {"q":"What can be prepared in advance to avoid panic in a crisis?","a":"A clear response can be rehearsed in advance, so nothing has to be improvised under pressure."},
   {"q":"How often should the risk register be reviewed?","a":"The register must be updated every week, and the top risks should be reviewed at the meeting."},
   {"q":"What should never be improvised in your business?","a":"A supplier-failure response should never be improvised; it has to be agreed and documented first."},
   {"q":"What risk in your area should be escalated immediately?","a":"Any single point of failure should be escalated immediately, because the impact could be severe."}]}
]

# 279 - Participle clauses
data["279"] = [
 {"title":"Open cloze — orações participiais (-ing / -ed) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"___ small, we protected the roll-out from unrealistic deadlines.","a":"Starting"},
   {"q":"A tool ___ well beats a system abandoned.","a":"used"},
   {"q":"The team ___ last week is ready to go live.","a":"trained"},
   {"q":"___ the data, she found three errors in the feed.","a":"Reviewing / Checking"},
   {"q":"The licences ___ in March are already paying off.","a":"bought / purchased"},
   {"q":"___ by poor adoption, the first tool failed.","a":"Held back / Hampered"},
   {"q":"The dashboard, ___ daily, keeps the team focused.","a":"updated / refreshed"},
   {"q":"___ the use cases first, we avoided wasted spend.","a":"Defining / Mapping"},
   {"q":"A system ___ without training rarely sticks.","a":"installed / rolled out"},
   {"q":"___ on real adoption, we measured logins, not licences.","a":"Focusing"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"The team that was trained last week is ready.  ·  (TRAINED)  ·  The team ___ is ready.","a":"trained last week"},
   {"q":"Because we started small, we protected the roll-out.  ·  (STARTING)  ·  ___ , we protected the roll-out.","a":"Starting small"},
   {"q":"She reviewed the data and found three errors.  ·  (REVIEWING)  ·  ___ , she found three errors.","a":"Reviewing the data"},
   {"q":"A tool that is used well beats one that is abandoned.  ·  (USED)  ·  A tool ___ beats one abandoned.","a":"used well"},
   {"q":"The licences that we bought in March are paying off.  ·  (BOUGHT)  ·  The licences ___ are paying off.","a":"bought in March"},
   {"q":"Because we focused on adoption, we measured logins.  ·  (FOCUSING)  ·  ___ , we measured logins.","a":"Focusing on adoption"}]},
 {"title":"Multiple-choice cloze — escolha o particípio","note":"Marque a opção certa.","items":[
   {"q":"___ small, we avoided unrealistic deadlines. (a) Started (b) Starting (c) To start","a":"(b) Starting"},
   {"q":"The team ___ last week is ready. (a) training (b) trained (c) to train","a":"(b) trained"},
   {"q":"___ the data, she spotted three errors. (a) Reviewed (b) Reviewing (c) Review","a":"(b) Reviewing"},
   {"q":"A tool ___ well beats one abandoned. (a) using (b) used (c) to use","a":"(b) used"},
   {"q":"The licences ___ in March are paying off. (a) buying (b) bought (c) to buy","a":"(b) bought"},
   {"q":"___ on adoption, we tracked logins. (a) Focused (b) Focusing (c) To focus","a":"(b) Focusing"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"Started small, we protected the roll-out.","a":"Starting small, we protected the roll-out. (sujeito ativo 'we' → particípio presente -ing)"},
   {"q":"The team training last week is ready.","a":"The team trained last week is ready. (sentido passivo: a equipe foi treinada → -ed)"},
   {"q":"Reviewed the data, she found three errors.","a":"Reviewing the data, she found three errors. (ela fez a ação → -ing)"},
   {"q":"A tool using well beats a system abandoned.","a":"A tool used well beats a system abandoned. (a ferramenta é usada → -ed)"},
   {"q":"Focused on adoption, we measured logins.","a":"Focusing on adoption, we measured logins. (nós nos concentramos → -ing)"},
   {"q":"The licences buying in March are paying off.","a":"The licences bought in March are paying off. (as licenças foram compradas → -ed)"}]},
 {"title":"Collocations & vocabulary building — ferramentas digitais (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to roll out a tool","a":"implantar uma ferramenta"},
   {"q":"user adoption","a":"adoção pelos usuários"},
   {"q":"a proof of concept","a":"uma prova de conceito"},
   {"q":"to go live","a":"entrar em produção"},
   {"q":"a pilot project","a":"um projeto-piloto"},
   {"q":"to onboard users","a":"integrar/treinar usuários"},
   {"q":"a use case","a":"um caso de uso"},
   {"q":"to scale up","a":"escalar/ampliar"},
   {"q":"real-time visibility","a":"visibilidade em tempo real"},
   {"q":"to integrate with a system","a":"integrar a um sistema"}]},
 {"title":"Fale sobre você / Discuss — orações participiais no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"How did you protect a recent roll-out from failing?","a":"Starting small, we ran a pilot first and protected the roll-out from unrealistic deadlines."},
   {"q":"What did you discover while reviewing a system or report?","a":"Reviewing the data feed, I found three errors that had been hiding our real lead times."},
   {"q":"What tool, used well, has made the biggest difference?","a":"A tracking dashboard, used well by the whole team, has cut the time we spend chasing updates."},
   {"q":"How do you measure whether a new tool is really adopted?","a":"Focusing on adoption, I measure daily logins and real use, not just the number of licences bought."},
   {"q":"Describe a team that is now ready after recent training.","a":"The team trained last month is ready, so we can go live on the new system next week."},
   {"q":"What lesson, learned the hard way, shapes your roll-outs now?","a":"Having seen one tool abandoned, I now invest in training before counting any project as done."}]}
]

# 280 - Modals of advice (had better, should, ought to)
data["280"] = [
 {"title":"Open cloze — modais de conselho (had better/should/ought to) (supply-chain)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"You had ___ start measuring your footprint now — the deadline is close.","a":"better"},
   {"q":"Companies ___ begin with their biggest lanes first.","a":"should / ought"},
   {"q":"The board ___ to review the carbon data before the disclosure.","a":"ought"},
   {"q":"We had better not ___ on unverified claims.","a":"rely / depend"},
   {"q":"You ___ measure before you make any sustainability promise.","a":"should / ought"},
   {"q":"They ought ___ consolidate loads to cut emissions.","a":"to"},
   {"q":"We ___ better act this quarter or we will miss the target.","a":"had"},
   {"q":"The company ___ invest in certified suppliers, in my view.","a":"should / ought"},
   {"q":"You ___ not to treat sustainability as a marketing campaign.","a":"ought"},
   {"q":"We ___ start with real data rather than nice slogans.","a":"should / ought"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"It is urgent that you start measuring now.  ·  (BETTER)  ·  You ___ measuring now.","a":"had better start"},
   {"q":"My advice is to begin with the biggest lanes.  ·  (SHOULD)  ·  You ___ with the biggest lanes.","a":"should begin"},
   {"q":"It would be wise for the board to review the data.  ·  (OUGHT)  ·  The board ___ the data.","a":"ought to review"},
   {"q":"It is risky to rely on unverified claims.  ·  (BETTER)  ·  We ___ on unverified claims.","a":"had better not rely"},
   {"q":"I recommend investing in certified suppliers.  ·  (SHOULD)  ·  The company ___ in certified suppliers.","a":"should invest"},
   {"q":"It is advisable to consolidate loads.  ·  (OUGHT)  ·  We ___ loads.","a":"ought to consolidate"}]},
 {"title":"Multiple-choice cloze — escolha o modal de conselho","note":"Marque a opção certa.","items":[
   {"q":"You ___ start measuring now; the deadline is near. (a) had better (b) ought (c) should to","a":"(a) had better"},
   {"q":"Companies ___ begin with their biggest lanes. (a) should (b) had better to (c) ought","a":"(a) should"},
   {"q":"The board ___ review the carbon data. (a) should to (b) ought to (c) had better to","a":"(b) ought to"},
   {"q":"We ___ rely on unverified claims. (a) had better not (b) should to not (c) ought not to better","a":"(a) had better not"},
   {"q":"You ___ treat this as marketing. (a) shouldn't (b) ought not (c) had not better","a":"(a) shouldn't"},
   {"q":"We ___ start with real data. (a) ought to (b) had better to (c) should to","a":"(a) ought to"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"You had better to start measuring now.","a":"You had better start measuring now. (had better + base, sem to)"},
   {"q":"Companies should to begin with the biggest lanes.","a":"Companies should begin with the biggest lanes. (should + base, sem to)"},
   {"q":"The board ought review the carbon data.","a":"The board ought to review the carbon data. (ought to + base; precisa do to)"},
   {"q":"We had not better rely on unverified claims.","a":"We had better not rely on unverified claims. (negativa: had better not)"},
   {"q":"You shouldn't to treat this as marketing.","a":"You shouldn't treat this as marketing. (shouldn't + base, sem to)"},
   {"q":"We ought start with real data.","a":"We ought to start with real data. (ought to + base)"}]},
 {"title":"Collocations & vocabulary building — sustentabilidade (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"a carbon footprint","a":"uma pegada de carbono"},
   {"q":"to offset emissions","a":"compensar emissões"},
   {"q":"a certified supplier","a":"um fornecedor certificado"},
   {"q":"to consolidate shipments","a":"consolidar embarques"},
   {"q":"a sustainability target","a":"uma meta de sustentabilidade"},
   {"q":"to greenwash","a":"fazer maquiagem verde"},
   {"q":"net zero","a":"zero líquido (de emissões)"},
   {"q":"a circular supply chain","a":"uma cadeia circular"},
   {"q":"to track real data","a":"acompanhar dados reais"},
   {"q":"to disclose emissions","a":"divulgar emissões"}]},
 {"title":"Fale sobre você / Discuss — modais de conselho no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What had your company better start doing on sustainability?","a":"We had better start measuring our real carbon footprint now, before the disclosure deadline."},
   {"q":"Where should a supply chain begin its emissions work?","a":"A supply chain should begin with its biggest lanes, because that is where the impact is largest."},
   {"q":"What ought leaders to review before making green claims?","a":"Leaders ought to review the real data first, so the claims are based on evidence, not slogans."},
   {"q":"What had your team better avoid?","a":"We had better not treat sustainability as a marketing campaign, or our customers will lose trust."},
   {"q":"What should your suppliers do to support your targets?","a":"My suppliers should provide real data and ought to move towards certified, lower-carbon options."},
   {"q":"What practical step should you take this quarter?","a":"This quarter we should consolidate shipments on our top lanes to cut both cost and emissions."}]}
]

out = "/Users/gilbertoluchetti/Alumni/cursos/scripts/rise_extra/supply-chain.json"
with open(out, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)
print("written", out)
print(len(data), all(len(v)==6 for v in data.values()))
