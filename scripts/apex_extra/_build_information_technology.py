import json

TRACK = "information-technology"
OUT = "/Users/gilbertoluchetti/Alumni/cursos/scripts/apex_extra/information-technology.json"

data = {}

# ---------------------------------------------------------------------------
# 521 — IT as Strategic Function — Nominalisation for formal register
# ---------------------------------------------------------------------------
data["521"] = [
 {"title":"Open cloze (avançado) — Nominalização para registro formal (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"The shaping ___ of IT at Czarnikow is now openly acknowledged at board level.","a":"role / influence"},
  {"q":"Any meaningful improvement ___ our security posture depends on sustained investment.","a":"in"},
  {"q":"The limiting effect ___ legacy systems on strategy is impossible to ignore.","a":"of"},
  {"q":"There has been a marked shift in the perception ___ IT as a mere cost centre.","a":"of"},
  {"q":"The scalability ___ the platform was the decisive consideration for the trading desk.","a":"of"},
  {"q":"Greater clarity ___ ownership would reduce much of the friction between functions.","a":"of / over"},
  {"q":"The exposure ___ strategic risk grows whenever infrastructure decisions are deferred.","a":"to"},
  {"q":"The alignment ___ IT with commercial priorities remains a work in progress.","a":"of"},
  {"q":"A reduction ___ our dependence on a single supplier is now a stated objective.","a":"in"},
  {"q":"The framing ___ IT as an enabler, rather than a constraint, changed the conversation entirely.","a":"of"}]},
 {"title":"Key word transformation — mantenha o sentido (nominalização)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"IT increasingly shapes what the business can become.  ·  (SHAPING)  ·  The ___ the business can become is increasingly significant.","a":"shaping role IT plays in what"},
  {"q":"Our systems constrain how far strategy can go.  ·  (CONSTRAINT)  ·  Our systems impose a real ___ how far strategy can go.","a":"constraint on"},
  {"q":"The board now recognises that IT enables growth.  ·  (RECOGNITION)  ·  There is now board-level ___ as an enabler of growth.","a":"recognition of IT"},
  {"q":"We depend heavily on one infrastructure supplier.  ·  (DEPENDENCE)  ·  Our heavy ___ supplier is a strategic concern.","a":"dependence on one infrastructure"},
  {"q":"The company can scale only as fast as its platform allows.  ·  (SCALABILITY)  ·  The ___ is bounded by the platform.","a":"scalability of the company"},
  {"q":"We must improve how secure the organisation is.  ·  (IMPROVEMENT)  ·  An ___ posture is now imperative.","a":"improvement in our security"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando nominalização.","items":[
  {"q":"IT really shapes what we can do as a business.","a":"The shaping role of IT in our strategic options has become decisive."},
  {"q":"Our old systems stop strategy from moving fast.","a":"The limiting effect of our legacy systems on strategic execution is considerable."},
  {"q":"We need to rely less on one supplier.","a":"A reduction in our dependence on a single supplier is now a priority."},
  {"q":"People are starting to see IT differently.","a":"There has been a perceptible shift in the perception of IT across the organisation."},
  {"q":"We have to make the platform able to grow.","a":"Enhancing the scalability of the platform is essential to future growth."},
  {"q":"IT lets the business do things it couldn't before.","a":"The enabling function of IT extends the boundaries of what the business can attempt."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"The dependence to a single vendor is our principal strategic risk.","a":"The dependence on a single vendor is our principal strategic risk. (a colocação correta é 'dependence on')"},
  {"q":"There has been a clear improvement of our security posture.","a":"There has been a clear improvement in our security posture. ('improvement in' é a preposição dependente)"},
  {"q":"The shaping role from IT is now widely acknowledged.","a":"The shaping role of IT is now widely acknowledged. (nominalização exige 'role of', não 'role from')"},
  {"q":"We must reduce the exposition to strategic risk.","a":"We must reduce the exposure to strategic risk. ('exposition' é falso cognato; o termo é 'exposure')"},
  {"q":"The alignment between IT with commercial goals is incomplete.","a":"The alignment of IT with commercial goals is incomplete. ('alignment of X with Y')"},
  {"q":"The constraint of the legacy systems are significant.","a":"The constraint imposed by the legacy systems is significant. (concordância: sujeito singular 'constraint' exige 'is')"}]},
 {"title":"Advanced collocations & lexis — comunicação estratégica de TI (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to be a force multiplier","a":"ser um multiplicador de força/impacto"},
  {"q":"a step change in capability","a":"um salto qualitativo de capacidade"},
  {"q":"to underpin the strategy","a":"sustentar/embasar a estratégia"},
  {"q":"to set the agenda","a":"definir a pauta"},
  {"q":"at an enterprise level","a":"no nível corporativo/da empresa toda"},
  {"q":"to punch above its weight","a":"render acima do esperado"},
  {"q":"a strategic enabler","a":"um habilitador estratégico"},
  {"q":"to move the needle","a":"fazer diferença mensurável"},
  {"q":"to operate in lockstep with","a":"operar em total sintonia com"},
  {"q":"to be mission-critical","a":"ser essencial à operação"}]},
 {"title":"Discuss / Argue — nominalização no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"How has the perception of IT changed in your organisation?","a":"The reframing of IT from a cost centre to a strategic enabler has fundamentally altered the conversations we have at board level."},
  {"q":"What is the greatest constraint your systems place on strategy?","a":"The principal limitation lies in the rigidity of our legacy architecture, the modernisation of which would unlock options currently closed to us."},
  {"q":"Why should IT have a seat at the strategy table?","a":"Given the shaping role of technology in everything we trade, the exclusion of IT from strategic deliberation strikes me as a structural oversight."},
  {"q":"How do you justify infrastructure spend to a sceptical board?","a":"I frame the investment as a reduction in strategic risk rather than a discretionary cost, which reorients the discussion toward resilience."},
  {"q":"What does 'IT as enabler' mean in practice for you?","a":"In practical terms, it denotes the extension of our commercial boundaries: the enabling function of IT determines the scale at which we can credibly compete."},
  {"q":"What would worry you most about your current security posture?","a":"My foremost concern is the concentration of our exposure in a single supplier, the failure of which would propagate across the entire operation."}]}
]

# ---------------------------------------------------------------------------
# 522 — Software Portfolios as Strategic Architecture — Abstract noun phrases
# ---------------------------------------------------------------------------
data["522"] = [
 {"title":"Open cloze (avançado) — Sintagmas nominais abstratos (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"The coherence ___ the software portfolio determines how cheaply it can evolve.","a":"of"},
  {"q":"The cost ___ untangling a tangled architecture tends to be grossly underestimated.","a":"of"},
  {"q":"Decisions taken ___ isolation accumulate into a portfolio nobody designed.","a":"in"},
  {"q":"The tendency ___ systems to drift apart is the default, not the exception.","a":"of / for"},
  {"q":"The wisdom ___ retiring an underused application is rarely appreciated until later.","a":"of"},
  {"q":"There is a hidden elegance ___ a portfolio that has been deliberately curated.","a":"in / to"},
  {"q":"The fragility ___ our integrations becomes apparent only under load.","a":"of"},
  {"q":"The absence ___ a clear architectural principle invites incremental chaos.","a":"of"},
  {"q":"The case ___ consolidation rests on the compounding cost of fragmentation.","a":"for"},
  {"q":"The maturity ___ our portfolio is best judged by how easily it absorbs change.","a":"of"}]},
 {"title":"Key word transformation — mantenha o sentido (sintagmas nominais abstratos)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"The portfolio is no longer coherent and that is costly.  ·  (INCOHERENCE)  ·  The ___ carries a real cost.","a":"incoherence of the portfolio"},
  {"q":"It is expensive to untangle architecture once it is tangled.  ·  (COST)  ·  The ___ a tangled architecture is high.","a":"cost of untangling"},
  {"q":"Each system was chosen on its own, which created drift.  ·  (TENDENCY)  ·  This created a ___ apart.","a":"tendency for systems to drift"},
  {"q":"We should retire the application, which would be wise.  ·  (WISDOM)  ·  The ___ the application is clear.","a":"wisdom of retiring"},
  {"q":"The architecture is fragile, and that exposes us.  ·  (FRAGILITY)  ·  The ___ exposes the business.","a":"fragility of the architecture"},
  {"q":"We never decided how things should connect.  ·  (ABSENCE)  ·  The ___ principle is the root cause.","a":"absence of a connecting"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando sintagmas nominais abstratos.","items":[
  {"q":"The portfolio doesn't hang together, and fixing it is pricey.","a":"The incoherence of the portfolio, and the cost of remedying it, can no longer be deferred."},
  {"q":"We bought each tool separately and now nothing fits.","a":"The procurement of each tool in isolation has produced a portfolio devoid of architectural logic."},
  {"q":"It would be smart to switch off the apps nobody uses.","a":"The retirement of underused applications represents an obvious source of structural saving."},
  {"q":"Our systems keep drifting apart over time.","a":"The gradual divergence of our systems is the predictable consequence of uncoordinated decisions."},
  {"q":"The way things connect is really fragile.","a":"The fragility of our integration layer is a latent operational liability."},
  {"q":"We made a big bet on this platform.","a":"The platform represents a substantial strategic bet on a single architectural direction."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"The coherence from the portfolio is questionable.","a":"The coherence of the portfolio is questionable. (sintagma abstrato exige 'of')"},
  {"q":"The cost for untangling the architecture is significant.","a":"The cost of untangling the architecture is significant. ('the cost of + -ing')"},
  {"q":"Decisions taken on isolation rarely add up.","a":"Decisions taken in isolation rarely add up. (a colocação fixa é 'in isolation')"},
  {"q":"The wisdom to retire the system is now evident.","a":"The wisdom of retiring the system is now evident. ('the wisdom of + -ing', não 'to')"},
  {"q":"The tendency of systems drifting apart is well known.","a":"The tendency of systems to drift apart is well known. (substantivo + infinitivo: 'tendency to drift')"},
  {"q":"There is an elegance on a well-curated portfolio.","a":"There is an elegance to a well-curated portfolio. ('elegance to/in', não 'on')"}]},
 {"title":"Advanced collocations & lexis — arquitetura de software (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"technical debt","a":"dívida técnica"},
  {"q":"a sprawling estate","a":"um parque/estate disperso e inchado"},
  {"q":"to rationalise the portfolio","a":"racionalizar o portfólio"},
  {"q":"a coherent whole","a":"um todo coerente"},
  {"q":"to bolt on (a system)","a":"acoplar/agregar de forma improvisada"},
  {"q":"a single source of truth","a":"uma fonte única da verdade"},
  {"q":"to creep in (complexity)","a":"infiltrar-se gradualmente"},
  {"q":"fit for purpose","a":"adequado ao propósito"},
  {"q":"to spiral out of control","a":"sair do controle progressivamente"},
  {"q":"a deliberate design choice","a":"uma escolha de design deliberada"}]},
 {"title":"Discuss / Argue — sintagmas abstratos no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"How healthy is your current software portfolio?","a":"Its principal weakness is the absence of a guiding architectural principle, which has allowed a degree of incoherence to accumulate over the years."},
  {"q":"What is the real cost of a tangled architecture?","a":"The visible cost is licensing; the insidious cost is the slowing of every subsequent change, a tax levied on the entire organisation."},
  {"q":"How do you decide what to retire?","a":"The case for retirement rests less on direct expense than on the reduction in cognitive and integration overhead it affords the wider estate."},
  {"q":"Why do portfolios drift over time?","a":"The drift stems from the cumulative effect of decisions taken in isolation, each defensible alone yet incoherent in aggregate."},
  {"q":"What makes an architecture strategic rather than accidental?","a":"What distinguishes the two is intentionality: a strategic architecture reflects the deliberate curation of a coherent whole rather than the accretion of expedient choices."},
  {"q":"How would you defend consolidation to finance?","a":"I would frame consolidation not as cost-cutting but as the purchase of optionality, since a coherent estate absorbs future change at a fraction of the cost."}]}
]

# ---------------------------------------------------------------------------
# 523 — Hardware and Infrastructure Strategy — Formal passive constructions
# ---------------------------------------------------------------------------
data["523"] = [
 {"title":"Open cloze (avançado) — Construções passivas formais (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"Infrastructure decisions are rarely ___ quickly once they have been taken.","a":"unwound / reversed"},
  {"q":"Optionality is either built ___ at the outset or quietly lost.","a":"in"},
  {"q":"The data centre location was selected only after extensive risk had ___ assessed.","a":"been"},
  {"q":"Capacity ceilings are frequently ___ until a workload tests them.","a":"overlooked / ignored"},
  {"q":"The provider mix has been deliberately ___ to avoid lock-in.","a":"diversified / spread"},
  {"q":"It is widely ___ that hardware is a long-term strategic asset, not a commodity.","a":"accepted / understood"},
  {"q":"Network topology should be ___ as carefully as any commercial contract.","a":"considered / treated"},
  {"q":"Once a provider has been ___ in, exit becomes prohibitively expensive.","a":"locked"},
  {"q":"These trade-offs are best ___ before, not after, the system goes live.","a":"made / resolved"},
  {"q":"The architecture was designed so that future options would not ___ be foreclosed.","a":"be / inadvertently"}]},
 {"title":"Key word transformation — mantenha o sentido (passiva formal)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"You cannot easily reverse infrastructure decisions.  ·  (UNWOUND)  ·  Infrastructure decisions ___ easily.","a":"cannot be unwound"},
  {"q":"We must build optionality into the design.  ·  (BUILT)  ·  Optionality must ___ the design.","a":"be built into"},
  {"q":"Someone selected the data centre after a long review.  ·  (SELECTED)  ·  The data centre ___ a long review.","a":"was selected after"},
  {"q":"We deliberately spread the work across providers.  ·  (SPREAD)  ·  The work ___ across providers.","a":"was deliberately spread"},
  {"q":"People often ignore capacity ceilings.  ·  (OVERLOOKED)  ·  Capacity ceilings ___ overlooked.","a":"are often overlooked"},
  {"q":"We should resolve these trade-offs upfront.  ·  (RESOLVED)  ·  These trade-offs ___ upfront.","a":"should be resolved"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando passiva.","items":[
  {"q":"You can't undo these decisions fast.","a":"Such decisions are rarely unwound quickly once committed to."},
  {"q":"We built in flexibility on purpose.","a":"Optionality was deliberately built into the design from the outset."},
  {"q":"We picked the location after checking the risks.","a":"The location was selected only after the attendant risks had been thoroughly assessed."},
  {"q":"We spread the work around so we wouldn't get locked in.","a":"The workload was distributed across providers precisely so that lock-in could be avoided."},
  {"q":"People forget about the capacity limits.","a":"Capacity ceilings are routinely overlooked until a demanding workload exposes them."},
  {"q":"You should sort these trade-offs out before going live.","a":"These trade-offs are best resolved before the system is brought into production."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Infrastructure decisions are rarely unwound it quickly.","a":"Infrastructure decisions are rarely unwound quickly. (a passiva não retoma objeto: remova 'it')"},
  {"q":"Optionality must be build in at the outset.","a":"Optionality must be built in at the outset. (passiva exige particípio 'built', não 'build')"},
  {"q":"The location was selected after the risks had assessed.","a":"The location was selected after the risks had been assessed. (passiva completa: 'had been assessed')"},
  {"q":"These trade-offs should make before going live.","a":"These trade-offs should be made before going live. (necessário 'be made' na passiva)"},
  {"q":"Once locked in a provider, exit is expensive.","a":"Once a provider has been locked in, exit is expensive. (sujeito e passiva explícitos para clareza formal)"},
  {"q":"It is wide accepted that hardware is strategic.","a":"It is widely accepted that hardware is strategic. (advérbio: 'widely', não 'wide')"}]},
 {"title":"Advanced collocations & lexis — infraestrutura estratégica (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to future-proof the estate","a":"preparar o parque para o futuro"},
  {"q":"vendor lock-in","a":"aprisionamento a um fornecedor"},
  {"q":"total cost of ownership","a":"custo total de propriedade"},
  {"q":"a sunk cost","a":"um custo irrecuperável"},
  {"q":"to over-provision","a":"superdimensionar capacidade"},
  {"q":"to hedge against (an outage)","a":"proteger-se contra (uma queda)"},
  {"q":"a single point of failure","a":"um ponto único de falha"},
  {"q":"to scale horizontally","a":"escalar horizontalmente"},
  {"q":"to bake in resilience","a":"incorporar resiliência desde a base"},
  {"q":"a long lead time","a":"um prazo de entrega longo"}]},
 {"title":"Discuss / Argue — passiva formal no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Why treat hardware as a strategic asset?","a":"Because infrastructure decisions are rarely unwound quickly, the choices we make today are effectively borne for a decade."},
  {"q":"How do you preserve optionality in infrastructure?","a":"Optionality is something that must be built in deliberately at the outset, since it is almost never recoverable once the architecture has hardened."},
  {"q":"What is the danger of vendor lock-in?","a":"Once a provider has been locked in, our negotiating leverage is materially eroded, and exit is priced accordingly."},
  {"q":"How was your last major infrastructure choice made?","a":"The decision was reached only after the principal risks had been mapped, and the provider mix was diversified specifically to contain concentration risk."},
  {"q":"Why are capacity ceilings so often missed?","a":"They are seldom examined until a demanding workload tests them, by which point the constraint has already become a live operational issue."},
  {"q":"How do you defend a costly resilience investment?","a":"I present it as insurance that is best purchased before, not after, the failure it is designed to prevent."}]}
]

# ---------------------------------------------------------------------------
# 524 — IT Department as Strategic Partner — Complex subordination
# ---------------------------------------------------------------------------
data["524"] = [
 {"title":"Open cloze (avançado) — Subordinação complexa (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"___ the shift is possible, it requires the CIO to change posture first.","a":"Although"},
  {"q":"IT will remain a service counter ___ it invites itself into strategic conversations.","a":"unless"},
  {"q":"___ that the team is trusted with real outcomes, it ceases to be merely reactive.","a":"Provided"},
  {"q":"___ commercial colleagues talk about revenue, IT too often talks about tickets.","a":"Whereas"},
  {"q":"The department can earn a seat at the table, ___ it must first stop staying in its lane.","a":"though / but"},
  {"q":"___ the technology is sound, the relationship may still be transactional.","a":"Even if / Even though"},
  {"q":"IT remains trapped in support work ___ leadership reframes its mandate.","a":"until / unless"},
  {"q":"___ as the business evolves, so too must the posture of IT.","a":"Just"},
  {"q":"The CIO must change first, ___ the rest of the function will follow the old pattern.","a":"otherwise"},
  {"q":"___ much the team delivers, perception lags behind reality.","a":"However"}]},
 {"title":"Key word transformation — mantenha o sentido (subordinação complexa)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"The shift is possible, but the CIO must change first.  ·  (ALTHOUGH)  ·  ___ possible, it requires the CIO to change.","a":"Although the shift is"},
  {"q":"IT will stay reactive if it is not trusted with outcomes.  ·  (PROVIDED)  ·  IT ceases to be reactive ___ with outcomes.","a":"provided it is trusted"},
  {"q":"Commercial teams discuss revenue; IT discusses tickets.  ·  (WHEREAS)  ·  ___ revenue, IT discusses tickets.","a":"Whereas commercial teams discuss"},
  {"q":"IT stays at the service counter until it speaks up.  ·  (UNLESS)  ·  IT stays at the counter ___ up.","a":"unless it speaks"},
  {"q":"The technology may be sound, yet the relationship is poor.  ·  (EVEN)  ·  ___ sound, the relationship can be poor.","a":"Even if the technology is"},
  {"q":"No matter how much it delivers, perception lags.  ·  (HOWEVER)  ·  ___ delivers, perception lags.","a":"However much it"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando subordinação.","items":[
  {"q":"IT can become a partner, but only if the CIO changes first.","a":"Although a strategic partnership is attainable, it is contingent on the CIO altering posture first."},
  {"q":"If we trust them with real results, they stop just reacting.","a":"Provided that the team is entrusted with genuine outcomes, it ceases to operate in a purely reactive mode."},
  {"q":"The business talks money; IT talks tickets. That's the problem.","a":"Whereas the business frames its work in commercial terms, IT too readily frames its own in terms of tickets."},
  {"q":"Even with great tech, the relationship can stay transactional.","a":"Even where the technology is excellent, the relationship may nonetheless remain transactional."},
  {"q":"IT stays stuck in support until someone redefines its role.","a":"IT will remain confined to support work unless its mandate is deliberately reframed."},
  {"q":"They need to stop staying in their lane.","a":"The function must relinquish the habit of staying strictly within its remit."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Despite the shift is possible, it needs the CIO to change.","a":"Although the shift is possible, it needs the CIO to change. ('despite' + substantivo; com oração, use 'although')"},
  {"q":"Provided the team is trusted, so it stops reacting.","a":"Provided the team is trusted, it stops merely reacting. (oração principal não leva 'so' após 'provided')"},
  {"q":"Whereas commercial colleagues talk revenue, but IT talks tickets.","a":"Whereas commercial colleagues talk revenue, IT talks tickets. ('whereas' já contrasta; remova 'but')"},
  {"q":"Unless IT speaks up, it won't never earn a seat.","a":"Unless IT speaks up, it will never earn a seat. (evite dupla negação)"},
  {"q":"Even if the technology is sound, but the relationship suffers.","a":"Even if the technology is sound, the relationship suffers. ('even if' não combina com 'but')"},
  {"q":"However much delivers the team, perception lags.","a":"However much the team delivers, perception lags. (ordem: sujeito antes do verbo após 'however much')"}]},
 {"title":"Advanced collocations & lexis — parceria estratégica de TI (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to earn a seat at the table","a":"conquistar um lugar à mesa"},
  {"q":"a trusted adviser","a":"um conselheiro de confiança"},
  {"q":"to shift the dynamic","a":"mudar a dinâmica"},
  {"q":"a transactional relationship","a":"uma relação transacional"},
  {"q":"to be brought in early","a":"ser envolvido cedo"},
  {"q":"to own the outcome","a":"assumir a responsabilidade pelo resultado"},
  {"q":"to break out of a silo","a":"romper com o silo"},
  {"q":"a value partner","a":"um parceiro de valor"},
  {"q":"to be reactive rather than proactive","a":"ser reativo em vez de proativo"},
  {"q":"to align incentives","a":"alinhar incentivos"}]},
 {"title":"Discuss / Argue — subordinação complexa no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"How does IT become a genuine strategic partner?","a":"Although the ambition is widely shared, it is realisable only provided that IT relinquishes its service-counter posture and invites itself into commercial conversations early."},
  {"q":"What keeps IT trapped in a reactive role?","a":"IT remains reactive precisely because, whereas its colleagues are measured on outcomes, it continues to measure itself on tickets resolved."},
  {"q":"Whose responsibility is the shift in posture?","a":"While the whole function must evolve, the burden falls first on the CIO, since the rest of the team will not change unless its leader does."},
  {"q":"Can good technology alone earn IT a seat at the table?","a":"Even where the technology is exemplary, a seat is granted only once the relationship ceases to be transactional and IT is trusted with real outcomes."},
  {"q":"What signals that IT has become a partner?","a":"The clearest signal is that, whereas IT was once consulted after decisions were taken, it is now brought in before them."},
  {"q":"How would you reframe IT's mandate to your board?","a":"I would argue that, provided the function is held accountable for business outcomes rather than service metrics, its contribution can be reframed from cost to capability."}]}
]

# ---------------------------------------------------------------------------
# 525 — Cloud Strategy at the Top — Hypothetical past
# ---------------------------------------------------------------------------
data["525"] = [
 {"title":"Open cloze (avançado) — Passado hipotético (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"Had we committed to one provider without thinking, we ___ now be negotiating from weakness.","a":"would"},
  {"q":"___ we anticipated the cost profile, we would have structured the contract differently.","a":"Had"},
  {"q":"If only we ___ retained a multi-cloud option, our leverage would be far greater today.","a":"had"},
  {"q":"Were the dependency less acute, procurement ___ have considerably more room.","a":"would"},
  {"q":"Had the lock-in been understood, the board ___ never have approved it.","a":"would"},
  {"q":"Suppose we ___ diversified earlier — where would our cost base sit now?","a":"had"},
  {"q":"But for the early hybrid decision, we ___ be wholly captive to one vendor today.","a":"would"},
  {"q":"Had they not pushed back, the ceiling ___ have been reached far sooner.","a":"would"},
  {"q":"___ it not been for the migration, our resilience would now be markedly weaker.","a":"Had"},
  {"q":"We would have far more leverage now ___ we had kept our options open.","a":"had / if"}]},
 {"title":"Key word transformation — mantenha o sentido (passado hipotético / condicional misto)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"We committed to one vendor, so we are weak now.  ·  (HAD)  ·  ___ to one vendor, we would not be weak now.","a":"Had we not committed"},
  {"q":"We didn't keep a multi-cloud option, so we lack leverage today.  ·  (KEPT)  ·  If we ___ option, we would have leverage today.","a":"had kept a multi-cloud"},
  {"q":"The dependency is acute, so procurement has little room.  ·  (WERE)  ·  ___ less acute, procurement would have room.","a":"Were the dependency"},
  {"q":"We didn't see the lock-in, so the board approved it.  ·  (HAD)  ·  ___ the lock-in, the board would not have approved it.","a":"Had we seen"},
  {"q":"We migrated, which is why we are resilient now.  ·  (NOT)  ·  Had we ___ , we would be less resilient now.","a":"not migrated"},
  {"q":"They pushed back, so the ceiling was not reached early.  ·  (BUT)  ·  ___ their pushback, the ceiling would have come sooner.","a":"But for"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando passado hipotético.","items":[
  {"q":"We picked one vendor too fast, and now we're stuck.","a":"Had we not committed to a single vendor prematurely, we would not now be negotiating from a position of weakness."},
  {"q":"If we'd kept more options, we'd be in a better spot today.","a":"Had we preserved greater optionality, our leverage today would be considerably stronger."},
  {"q":"We didn't see the lock-in coming, so we approved it.","a":"Had the extent of the lock-in been understood, the proposal would never have secured board approval."},
  {"q":"Because we migrated, we're more resilient now.","a":"Were it not for the migration, our resilience would now be materially weaker."},
  {"q":"The dependency is too heavy, so we can't push back on price.","a":"Were our dependency less pronounced, we would enjoy far greater latitude in price negotiations."},
  {"q":"Good thing they argued against it back then.","a":"But for their objections at the time, we would today be wholly captive to one provider."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Had we committed to one vendor, we would now negotiating from weakness.","a":"Had we committed to one vendor, we would now be negotiating from weakness. (condicional misto exige 'would be + -ing')"},
  {"q":"If we would have diversified earlier, our costs would be lower now.","a":"If we had diversified earlier, our costs would be lower now. (a oração 'if' não leva 'would have')"},
  {"q":"Were the dependency less acute, procurement would had more room.","a":"Were the dependency less acute, procurement would have more room. (resultado presente: 'would have', não 'would had')"},
  {"q":"Had not we seen the lock-in, the board would have approved it.","a":"Had we not seen the lock-in, the board would have approved it. (inversão correta: 'Had we not')"},
  {"q":"But for their pushback, the ceiling will have come sooner.","a":"But for their pushback, the ceiling would have come sooner. (condicional irreal do passado: 'would have', não 'will have')"},
  {"q":"If only we kept a multi-cloud option, we would have leverage now.","a":"If only we had kept a multi-cloud option, we would have leverage now. (desejo sobre o passado: 'had kept')"}]},
 {"title":"Advanced collocations & lexis — estratégia de nuvem (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to negotiate from a position of strength","a":"negociar de uma posição de força"},
  {"q":"to hedge your bets","a":"diversificar/cobrir suas apostas"},
  {"q":"an exit strategy","a":"uma estratégia de saída"},
  {"q":"to retain leverage","a":"reter alavancagem"},
  {"q":"a captive customer","a":"um cliente cativo"},
  {"q":"to commoditise (the service)","a":"transformar em commodity"},
  {"q":"with hindsight","a":"em retrospecto"},
  {"q":"to second-guess a decision","a":"questionar uma decisão a posteriori"},
  {"q":"to be at the mercy of","a":"estar à mercê de"},
  {"q":"to keep one's options open","a":"manter as opções em aberto"}]},
 {"title":"Discuss / Argue — passado hipotético no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Looking back, what cloud decision would you take differently?","a":"Had we resisted the convenience of a single provider, we would today enjoy materially greater leverage in our renewals."},
  {"q":"How has past procurement shaped your present position?","a":"Were it not for an early insistence on a hybrid posture, we would now be wholly captive to one vendor's pricing."},
  {"q":"What is the cost of vendor lock-in in your experience?","a":"Had the full extent of the lock-in been understood at the outset, I doubt the board would have approved the commitment as readily as it did."},
  {"q":"Why preserve optionality even at a premium?","a":"Because optionality, once surrendered, is rarely recoverable; had we paid that modest premium, our negotiating position today would be incomparably stronger."},
  {"q":"How do you frame a migration to a sceptical board?","a":"I argue counterfactually: were it not for the migration, our resilience and our destiny would both rest in a single supplier's hands."},
  {"q":"What lesson do you carry from a past cloud mistake?","a":"Chiefly that, had we separated the technical choice from the strategic one, we would not have conflated convenience with commitment."}]}
]

# ---------------------------------------------------------------------------
# 526 — On-Premise and Cloud: Strategic Balance — Inversion for emphasis
# ---------------------------------------------------------------------------
data["526"] = [
 {"title":"Open cloze (avançado) — Inversão para ênfase (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"Rarely ___ a serious company sit at either extreme of the on-premise–cloud debate.","a":"does"},
  {"q":"Not only ___ a purist stance defensible, it is often commercially naive.","a":"is"},
  {"q":"Seldom ___ a single workload dictate the entire infrastructure strategy.","a":"should"},
  {"q":"No sooner ___ the migration begun than regulatory questions surfaced.","a":"had"},
  {"q":"Only when performance is tested ___ the true cost profile become clear.","a":"does"},
  {"q":"Under no circumstances ___ ideology override a defensible technical judgement.","a":"should"},
  {"q":"So variable ___ the workload that a fixed on-premise base proved wasteful.","a":"was"},
  {"q":"Little ___ the board appreciate how regulatory constraints would shape the mix.","a":"did"},
  {"q":"Not until both options had been costed ___ we reach a balanced decision.","a":"did"},
  {"q":"Nowhere ___ the case for purity weaker than in a regulated, variable environment.","a":"is"}]},
 {"title":"Key word transformation — mantenha o sentido (inversão)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"A serious company seldom sits at either extreme.  ·  (RARELY)  ·  ___ a serious company sit at either extreme.","a":"Rarely does"},
  {"q":"The purist stance is not only indefensible but naive.  ·  (ONLY)  ·  Not ___ indefensible, it is naive.","a":"only is the purist stance"},
  {"q":"You must never let ideology override judgement.  ·  (CIRCUMSTANCES)  ·  Under no ___ override judgement.","a":"circumstances should ideology"},
  {"q":"The workload was so variable that on-premise was wasteful.  ·  (SO)  ·  ___ that on-premise was wasteful.","a":"So variable was the workload"},
  {"q":"We only decided once both options had been costed.  ·  (ONLY)  ·  Only once both options had been costed ___ .","a":"did we decide"},
  {"q":"The board hardly realised how regulation would shape the mix.  ·  (LITTLE)  ·  Little ___ how regulation would shape the mix.","a":"did the board realise"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando inversão.","items":[
  {"q":"A serious firm almost never sits at one extreme.","a":"Rarely does a serious firm sit at either extreme of the debate."},
  {"q":"Being a purist isn't just wrong, it's commercially naive.","a":"Not only is the purist position untenable, it is also commercially naive."},
  {"q":"You should never let ideology beat technical judgement.","a":"Under no circumstances should ideological purity override sound technical judgement."},
  {"q":"The workload changed so much that on-premise was wasteful.","a":"So variable was the workload that a fixed on-premise base proved demonstrably wasteful."},
  {"q":"We only decided after costing both options properly.","a":"Only after both options had been rigorously costed did we reach a balanced decision."},
  {"q":"The board didn't really see how regulation would shape it.","a":"Little did the board appreciate the extent to which regulation would shape the eventual mix."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Rarely a serious company sits at either extreme.","a":"Rarely does a serious company sit at either extreme. (advérbio negativo inicial força inversão com 'does')"},
  {"q":"Not only the purist stance is naive, it is also costly.","a":"Not only is the purist stance naive, it is also costly. ('not only' inicial inverte: 'is the purist stance')"},
  {"q":"Under no circumstances ideology should override judgement.","a":"Under no circumstances should ideology override judgement. (inverte sujeito e modal: 'should ideology')"},
  {"q":"So variable the workload was that on-premise failed.","a":"So variable was the workload that on-premise failed. (após 'so + adj', inverte: 'was the workload')"},
  {"q":"Only when we costed both options we decided.","a":"Only when we costed both options did we decide. ('only when' inicial força inversão: 'did we decide')"},
  {"q":"No sooner the migration had begun than questions arose.","a":"No sooner had the migration begun than questions arose. (inversão: 'had the migration begun')"}]},
 {"title":"Advanced collocations & lexis — equilíbrio nuvem/on-premise (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to strike a balance","a":"encontrar um equilíbrio"},
  {"q":"a pragmatic middle ground","a":"um meio-termo pragmático"},
  {"q":"a defensible position","a":"uma posição defensável"},
  {"q":"to be workload-dependent","a":"depender da carga de trabalho"},
  {"q":"ideological purity","a":"pureza ideológica"},
  {"q":"a horses-for-courses approach","a":"a abordagem de 'cada caso, um caso'"},
  {"q":"to right-size the estate","a":"dimensionar adequadamente o parque"},
  {"q":"a false dichotomy","a":"uma falsa dicotomia"},
  {"q":"on balance","a":"no cômputo geral"},
  {"q":"to weigh the trade-offs","a":"ponderar os trade-offs"}]},
 {"title":"Discuss / Argue — inversão e ênfase no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Should infrastructure strategy ever be ideological?","a":"Under no circumstances should ideology override technical judgement; rarely does a serious organisation gain from a purist stance."},
  {"q":"What surprised you most about a cloud–on-premise decision?","a":"Little did we appreciate how decisively regulatory constraints would shape the mix, irrespective of the technical merits."},
  {"q":"How do you avoid the cloud-versus-on-premise false dichotomy?","a":"Not only is the dichotomy false, it is actively misleading, since the right answer is almost always workload-dependent."},
  {"q":"What governs where a given workload should sit?","a":"So variable are the demands across our estate that no single placement principle survives contact with the actual data."},
  {"q":"When did the real cost of an option become clear to you?","a":"Only when the workload was tested at scale did the true cost profile become apparent."},
  {"q":"How do you frame a balanced infrastructure recommendation?","a":"Seldom does either extreme withstand scrutiny, so I present a defensible middle ground anchored in measured trade-offs rather than preference."}]}
]

# ---------------------------------------------------------------------------
# 527 — Network and Connectivity — Cleft sentences
# ---------------------------------------------------------------------------
data["527"] = [
 {"title":"Open cloze (avançado) — Orações clivadas (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"___ matters at this level is not the technical detail but the strategic implication.","a":"What"},
  {"q":"It is the network ___ ultimately decides what is physically possible for the business.","a":"that"},
  {"q":"___ the board needs to grasp is the network as a single point of failure.","a":"What"},
  {"q":"It was only after the outage ___ leadership took latency seriously.","a":"that"},
  {"q":"___ we should be discussing is ambition, not bandwidth.","a":"What"},
  {"q":"It is connectivity, ___ raw compute, that increasingly limits our reach.","a":"not / rather than"},
  {"q":"The thing ___ determines whether we can hire in the provinces is the network.","a":"that"},
  {"q":"___ truly constrains expansion is the absence of low-latency links.","a":"What"},
  {"q":"It is precisely ___ such failures go unnoticed that makes them dangerous.","a":"because"},
  {"q":"All ___ leadership really needs to decide is the level of ambition.","a":"that"}]},
 {"title":"Key word transformation — mantenha o sentido (cleft)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"The strategic implication matters most, not the detail.  ·  (WHAT)  ·  ___ is the strategic implication, not the detail.","a":"What matters most"},
  {"q":"The network decides what is physically possible.  ·  (IT)  ·  ___ what is physically possible.","a":"It is the network that decides"},
  {"q":"The board must grasp the single point of failure.  ·  (WHAT)  ·  ___ is the single point of failure.","a":"What the board must grasp"},
  {"q":"Leadership only acted after the outage.  ·  (IT)  ·  ___ leadership acted.","a":"It was only after the outage that"},
  {"q":"Connectivity, not compute, limits our reach.  ·  (IT)  ·  ___ limits our reach.","a":"It is connectivity, not compute, that"},
  {"q":"The network determines whether we can hire remotely.  ·  (WHAT)  ·  ___ whether we can hire remotely is the network.","a":"What determines"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando cleft.","items":[
  {"q":"The detail isn't the point; the strategy is.","a":"What matters at this level is not the technical detail but the strategic implication."},
  {"q":"The network decides what we can actually do.","a":"It is the network that ultimately determines what is physically possible for the business."},
  {"q":"They only cared about latency after it broke.","a":"It was only after the outage that leadership began to treat latency as a strategic concern."},
  {"q":"Connectivity is the real constraint, not compute.","a":"It is connectivity, rather than compute, that increasingly constrains our ambitions."},
  {"q":"We should be talking about how far we want to go.","a":"What we ought to be discussing is the level of ambition the network must support."},
  {"q":"A single point of failure is the scary part.","a":"What should most concern the board is the network's status as a single point of failure."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"What matters at this level are the strategic implications.","a":"What matters at this level is the strategic implication. (cleft com 'what' leva verbo no singular)"},
  {"q":"It is the network which decides what is possible, isn't it?","a":"It is the network that decides what is possible. (registro formal evita question tag coloquial; preferir 'that')"},
  {"q":"What the board needs grasp is the single point of failure.","a":"What the board needs to grasp is the single point of failure. (faltava 'to': 'needs to grasp')"},
  {"q":"It was only after the outage when leadership acted.","a":"It was only after the outage that leadership acted. (cleft usa 'that', não 'when')"},
  {"q":"Is connectivity that limits our reach, not compute.","a":"It is connectivity that limits our reach, not compute. (cleft exige sujeito introdutório 'It')"},
  {"q":"The thing what determines hiring is the network.","a":"The thing that determines hiring is the network. (relativo correto é 'that', não 'what')"}]},
 {"title":"Advanced collocations & lexis — rede e conectividade (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"a single point of failure","a":"um ponto único de falha"},
  {"q":"to be the limiting factor","a":"ser o fator limitante"},
  {"q":"resilient by design","a":"resiliente por concepção"},
  {"q":"to build in redundancy","a":"incorporar redundância"},
  {"q":"end-to-end latency","a":"latência ponta a ponta"},
  {"q":"a backbone link","a":"um enlace de backbone"},
  {"q":"to degrade gracefully","a":"degradar de forma controlada"},
  {"q":"mission-critical connectivity","a":"conectividade crítica para a operação"},
  {"q":"to underwrite the ambition","a":"sustentar/garantir a ambição"},
  {"q":"a chokepoint","a":"um gargalo/ponto de estrangulamento"}]},
 {"title":"Discuss / Argue — clivadas no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Why should the network be a board-level concern?","a":"What the board fails to appreciate is that it is the network, not the applications, that decides what the business is physically capable of doing."},
  {"q":"What is the real strategic risk in your connectivity?","a":"It is the existence of a single point of failure, rather than raw bandwidth, that keeps me awake at night."},
  {"q":"What should leadership actually decide about networks?","a":"What leadership genuinely needs to settle is the level of ambition; the topology should follow from that, not precede it."},
  {"q":"When did connectivity become a strategic issue for you?","a":"It was only after a regional outage that the organisation finally treated latency as a commercial, not merely a technical, variable."},
  {"q":"How do you reframe a bandwidth request as strategy?","a":"What I emphasise is not the cost of the link but the markets and talent it makes physically reachable."},
  {"q":"What constrains expansion more than people expect?","a":"What truly constrains our expansion is connectivity in the provinces, since it is the absence of low-latency links that quietly caps where we can credibly operate."}]}
]

# ---------------------------------------------------------------------------
# 528 — Data Strategy and Backup Architecture — Complex passive with modals
# ---------------------------------------------------------------------------
data["528"] = [
 {"title":"Open cloze (avançado) — Passiva complexa com modais (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"Priceless data must ___ backed up, documented and tested at full scale.","a":"be"},
  {"q":"Recovery targets ought to ___ been agreed long before any incident occurs.","a":"have"},
  {"q":"No restore procedure should ___ trusted until it has been rehearsed under load.","a":"be"},
  {"q":"Replaceable data need not ___ protected to the same exacting standard.","a":"be"},
  {"q":"A data centre failure must ___ planned for, however improbable it may seem.","a":"be"},
  {"q":"These backups should have ___ tested at full scale, not merely in theory.","a":"been"},
  {"q":"Critical datasets cannot ___ allowed to depend on a single location.","a":"be"},
  {"q":"Every assumption must ___ challenged before it is relied upon in a crisis.","a":"be"},
  {"q":"The worst day is one for which we ought to ___ prepared in calmer times.","a":"have"},
  {"q":"Nothing should ___ taken on trust where the survival of data is concerned.","a":"be"}]},
 {"title":"Key word transformation — mantenha o sentido (passiva com modais)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"We must back up and test priceless data at full scale.  ·  (BACKED)  ·  Priceless data must ___ at full scale.","a":"be backed up and tested"},
  {"q":"We should have agreed recovery targets earlier.  ·  (AGREED)  ·  Recovery targets should ___ earlier.","a":"have been agreed"},
  {"q":"You can't trust a restore until you rehearse it.  ·  (TRUSTED)  ·  A restore cannot ___ it is rehearsed.","a":"be trusted until"},
  {"q":"We needn't protect replaceable data so strictly.  ·  (PROTECTED)  ·  Replaceable data need ___ so strictly.","a":"not be protected"},
  {"q":"Someone must plan for a data centre failure.  ·  (PLANNED)  ·  A data centre failure must ___ .","a":"be planned for"},
  {"q":"We ought to have prepared in calmer times.  ·  (PREPARED)  ·  We ought to ___ in calmer times.","a":"have prepared"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando passiva com modais.","items":[
  {"q":"We have to back up the important data and test it for real.","a":"Priceless data must be backed up, documented and tested at full scale."},
  {"q":"We should have set recovery targets way before any incident.","a":"Recovery targets ought to have been agreed well in advance of any incident."},
  {"q":"Don't trust a restore you haven't actually rehearsed.","a":"No restore procedure should be trusted until it has been rehearsed under realistic load."},
  {"q":"You don't need to protect throwaway data the same way.","a":"Replaceable data need not be protected to the same exacting standard."},
  {"q":"We must plan for a data centre going down.","a":"A data centre failure must be planned for, however remote the probability."},
  {"q":"We should have got ready when things were calm.","a":"We ought to have prepared in calmer times, when judgement is clearer than in a crisis."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Priceless data must to be backed up at full scale.","a":"Priceless data must be backed up at full scale. (modal 'must' não leva 'to')"},
  {"q":"Recovery targets should have agreed before the incident.","a":"Recovery targets should have been agreed before the incident. (passiva perfeita: 'have been agreed')"},
  {"q":"No restore should be trust until it is rehearsed.","a":"No restore should be trusted until it is rehearsed. (particípio: 'be trusted')"},
  {"q":"A data centre failure must be plan for.","a":"A data centre failure must be planned for. (passiva com verbo preposicional: 'be planned for')"},
  {"q":"Replaceable data needn't to be protected so strictly.","a":"Replaceable data needn't be protected so strictly. ('needn't' não leva 'to')"},
  {"q":"We ought to have been prepared in calmer times, didn't we?","a":"We ought to have prepared in calmer times. (registro formal evita question tag; e 'have prepared' é ativo aqui)"}]},
 {"title":"Advanced collocations & lexis — arquitetura de dados e backup (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"a recovery point objective (RPO)","a":"objetivo de ponto de recuperação"},
  {"q":"a recovery time objective (RTO)","a":"objetivo de tempo de recuperação"},
  {"q":"to fail over","a":"comutar para o sistema redundante"},
  {"q":"an air-gapped backup","a":"um backup isolado da rede"},
  {"q":"to stress-test the procedure","a":"submeter o procedimento a teste de estresse"},
  {"q":"a point of no return","a":"um ponto sem retorno"},
  {"q":"to be business-critical","a":"ser crítico para o negócio"},
  {"q":"disaster recovery","a":"recuperação de desastres"},
  {"q":"to restore from cold storage","a":"restaurar a partir de armazenamento frio"},
  {"q":"to leave nothing to chance","a":"não deixar nada ao acaso"}]},
 {"title":"Discuss / Argue — passiva com modais no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"How seriously does your firm treat backup architecture?","a":"My settled view is that priceless data must be backed up, documented and tested at full scale, not merely assumed to be recoverable."},
  {"q":"Why is a rehearsed restore non-negotiable?","a":"Because no restore procedure should be trusted until it has been exercised under realistic load; an untested backup is a hypothesis, not a safeguard."},
  {"q":"How do you prioritise what to protect?","a":"I distinguish sharply between the priceless and the replaceable: only the former need be protected to the most exacting standard."},
  {"q":"What should be decided before an incident, not during one?","a":"Recovery targets ought to have been agreed in calmer times, since they cannot be reasoned about clearly amid an unfolding crisis."},
  {"q":"How do you justify resilience spend that may never be used?","a":"I frame it plainly: a data centre failure must be planned for precisely because its improbability is no guarantee of its impossibility."},
  {"q":"What is your standard for trusting a recovery plan?","a":"Nothing should be taken on trust where the survival of data is concerned; every assumption must be challenged before it is relied upon."}]}
]

# ---------------------------------------------------------------------------
# 529 — AI Strategy at the Top — Subjunctive in formal recommendations
# ---------------------------------------------------------------------------
data["529"] = [
 {"title":"Open cloze (avançado) — Subjuntivo em recomendações formais (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"I recommend that every leader ___ a short AI portfolio and review it twice a year.","a":"build"},
  {"q":"It is essential that the interesting ___ separated from the genuinely urgent.","a":"be"},
  {"q":"The board insisted that no project ___ committed to production without a clear owner.","a":"be"},
  {"q":"We propose that each experiment ___ killed the moment it ceases to teach us anything.","a":"be"},
  {"q":"It is advisable that the team ___ resist the urge to chase every novelty.","a":"resist"},
  {"q":"I suggest that discipline ___ imposed before ambition, not after.","a":"be"},
  {"q":"It is imperative that the portfolio ___ reviewed every six months without fail.","a":"be"},
  {"q":"The committee requested that a single owner ___ named for each use case.","a":"be"},
  {"q":"We ask that no urge to impress ___ allowed to drive strategy.","a":"be"},
  {"q":"It is vital that what is merely interesting ___ not mistaken for what is urgent.","a":"be"}]},
 {"title":"Key word transformation — mantenha o sentido (subjuntivo)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"Every leader should build a short portfolio.  ·  (RECOMMEND)  ·  I recommend ___ a short portfolio.","a":"that every leader build"},
  {"q":"We must separate the interesting from the urgent.  ·  (ESSENTIAL)  ·  It is essential ___ from the urgent.","a":"that the interesting be separated"},
  {"q":"No project should go live without an owner.  ·  (INSIST)  ·  The board insisted ___ without an owner.","a":"that no project go live"},
  {"q":"Kill each experiment when it stops teaching.  ·  (PROPOSE)  ·  We propose ___ when it stops teaching.","a":"that each experiment be killed"},
  {"q":"The team must resist chasing every novelty.  ·  (ADVISABLE)  ·  It is advisable ___ every novelty.","a":"that the team resist chasing"},
  {"q":"Review the portfolio every six months.  ·  (IMPERATIVE)  ·  It is imperative ___ every six months.","a":"that the portfolio be reviewed"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando o subjuntivo.","items":[
  {"q":"Everyone running AI should keep a short portfolio and check it twice a year.","a":"I recommend that every leader build a short AI portfolio and review it every six months."},
  {"q":"We've got to tell apart what's interesting from what's actually urgent.","a":"It is essential that the merely interesting be separated from the genuinely urgent."},
  {"q":"Don't let any project go to production without someone owning it.","a":"The board insists that no project be committed to production without a designated owner."},
  {"q":"If an experiment stops teaching us anything, kill it.","a":"We propose that each experiment be discontinued the moment it ceases to yield learning."},
  {"q":"The team shouldn't chase every shiny new thing.","a":"It is advisable that the team resist the urge to pursue every novelty."},
  {"q":"Put discipline in place first, then ambition.","a":"I suggest that discipline be imposed before ambition rather than after it."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"I recommend that every leader builds a short portfolio.","a":"I recommend that every leader build a short portfolio. (subjuntivo: forma base 'build', sem '-s')"},
  {"q":"It is essential that the interesting is separated from the urgent.","a":"It is essential that the interesting be separated from the urgent. (subjuntivo passivo: 'be separated')"},
  {"q":"The board insisted that no project was committed without an owner.","a":"The board insisted that no project be committed without an owner. (subjuntivo: 'be committed')"},
  {"q":"We propose that each experiment will be killed when it stops teaching.","a":"We propose that each experiment be killed when it stops teaching. (não usar 'will' no subjuntivo)"},
  {"q":"It is imperative the portfolio be reviewed every six months.","a":"It is imperative that the portfolio be reviewed every six months. ('that' é preferível no registro formal)"},
  {"q":"I suggest discipline to be imposed before ambition.","a":"I suggest that discipline be imposed before ambition. (subjuntivo, não infinitivo: 'that ... be imposed')"}]},
 {"title":"Advanced collocations & lexis — estratégia de IA (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to separate signal from noise","a":"separar o sinal do ruído"},
  {"q":"a proof of concept","a":"uma prova de conceito"},
  {"q":"to graduate to production","a":"avançar para produção"},
  {"q":"to chase the shiny object","a":"perseguir a novidade reluzente"},
  {"q":"to set realistic expectations","a":"estabelecer expectativas realistas"},
  {"q":"to deprioritise","a":"despriorizar"},
  {"q":"a measured pace","a":"um ritmo comedido"},
  {"q":"to resist the hype","a":"resistir ao hype"},
  {"q":"to be outcome-driven","a":"ser orientado a resultados"},
  {"q":"to sunset a project","a":"encerrar/aposentar um projeto"}]},
 {"title":"Discuss / Argue — subjuntivo em recomendações no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"How should an executive govern an AI agenda?","a":"I would recommend that every leader maintain a short, honest portfolio and that it be reviewed at fixed intervals rather than on impulse."},
  {"q":"What discipline does AI strategy most require?","a":"It is essential that the merely interesting be separated from the genuinely urgent, lest novelty masquerade as priority."},
  {"q":"What gate would you place before production?","a":"I would insist that no use case be committed to production until a single, named owner has been established."},
  {"q":"When should an AI experiment be stopped?","a":"I propose that each experiment be discontinued the moment it ceases to teach us anything of value, however appealing it remains."},
  {"q":"How do you guard against AI hype internally?","a":"It is advisable that the organisation resist the urge to chase every novelty and instead let evidence, not excitement, set the pace."},
  {"q":"What sequencing matters most in AI strategy?","a":"I suggest that discipline be imposed before ambition, since a portfolio without governance accumulates activity without yielding results."}]}
]

# ---------------------------------------------------------------------------
# 530 — AI Use Cases as a Portfolio — Conditional perfect
# ---------------------------------------------------------------------------
data["530"] = [
 {"title":"Open cloze (avançado) — Condicional perfeito (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"Had we kept the portfolio all in experiments, we ___ have had nothing to show for it.","a":"would"},
  {"q":"If we had over-indexed on safe bets, we ___ have missed the breakthrough entirely.","a":"would"},
  {"q":"The workhorse projects ___ have stalled had we not protected their funding.","a":"would"},
  {"q":"Had the ratio been more balanced, the year ___ have ended very differently.","a":"would"},
  {"q":"We ___ have learned that expensive lesson sooner had we tracked the portfolio.","a":"would / could"},
  {"q":"Had we ignored the exploratory work, we ___ never have found the new direction.","a":"would"},
  {"q":"If only we ___ killed the failing project earlier, we would have saved the budget.","a":"had"},
  {"q":"The portfolio ___ have drifted toward novelty had no one enforced the balance.","a":"would"},
  {"q":"Had we committed everything to one bet, the downside ___ have been catastrophic.","a":"would / could"},
  {"q":"We ___ have had a steadier year had the safe bets carried more of the load.","a":"would"}]},
 {"title":"Key word transformation — mantenha o sentido (condicional perfeito)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"We didn't keep it all in experiments, so we had results.  ·  (HAD)  ·  ___ all in experiments, we would have had nothing.","a":"Had we kept it"},
  {"q":"We protected the funding, so the workhorses didn't stall.  ·  (WOULD)  ·  The workhorses ___ without protected funding.","a":"would have stalled"},
  {"q":"We tracked the portfolio, so we learned the lesson early.  ·  (NOT)  ·  Had we ___ , we would have learned it late.","a":"not tracked the portfolio"},
  {"q":"We funded exploration, so we found a new direction.  ·  (IGNORED)  ·  Had we ___ , we'd have found nothing.","a":"ignored the exploratory work"},
  {"q":"We didn't kill the project early, so we wasted budget.  ·  (KILLED)  ·  ___ earlier, we'd have saved the budget.","a":"Had we killed it"},
  {"q":"We balanced the ratio, so the year was steady.  ·  (BALANCED)  ·  ___ , the year would have been unsteady.","a":"Had the ratio not been balanced"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando condicional perfeito.","items":[
  {"q":"If we'd put everything into experiments, we'd have ended up with nothing.","a":"Had we confined the portfolio entirely to experiments, we would have had little to show for an exciting year."},
  {"q":"We funded the reliable projects, otherwise they'd have stalled.","a":"The workhorse projects would have stalled had we not deliberately protected their funding."},
  {"q":"Tracking the portfolio saved us from a costly lesson.","a":"Had we not tracked the portfolio rigorously, that expensive lesson would have arrived far later and dearer."},
  {"q":"Without the exploratory work, we'd never have found the new direction.","a":"Had we neglected the exploratory work, the new strategic direction would never have emerged."},
  {"q":"Killing that project sooner would have saved the budget.","a":"Had we discontinued the failing project earlier, a significant portion of the budget would have been preserved."},
  {"q":"A balanced mix kept the year steady.","a":"Had the balance between safe bets and exploration been neglected, the year would have proved markedly less steady."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Had we kept it all in experiments, we would had nothing to show.","a":"Had we kept it all in experiments, we would have had nothing to show. (condicional perfeito: 'would have had')"},
  {"q":"If we would have over-indexed on safe bets, we'd have missed it.","a":"If we had over-indexed on safe bets, we'd have missed it. (a oração 'if' usa 'had', não 'would have')"},
  {"q":"The workhorses would have stall had we cut their funding.","a":"The workhorses would have stalled had we cut their funding. (particípio: 'stalled')"},
  {"q":"Had we not tracked it, we will have learned the lesson late.","a":"Had we not tracked it, we would have learned the lesson late. (condicional irreal: 'would have', não 'will have')"},
  {"q":"If only we would have killed the project earlier.","a":"If only we had killed the project earlier. ('if only' sobre o passado leva 'had + particípio')"},
  {"q":"Had the ratio been balanced, the year would have ended very different.","a":"Had the ratio been balanced, the year would have ended very differently. (advérbio: 'differently')"}]},
 {"title":"Advanced collocations & lexis — portfólio de casos de IA (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"a balanced portfolio","a":"um portfólio equilibrado"},
  {"q":"a quick win","a":"um ganho rápido"},
  {"q":"a moonshot","a":"uma aposta ousada de alto risco"},
  {"q":"to spread risk","a":"distribuir risco"},
  {"q":"to double down on","a":"redobrar a aposta em"},
  {"q":"a bet that pays off","a":"uma aposta que dá certo"},
  {"q":"to cut your losses","a":"cortar as perdas"},
  {"q":"a sunk-cost trap","a":"a armadilha do custo irrecuperável"},
  {"q":"to have something to show for it","a":"ter algo a apresentar como resultado"},
  {"q":"to rebalance the mix","a":"reequilibrar a composição"}]},
 {"title":"Discuss / Argue — condicional perfeito no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"How do you justify keeping some exploratory bets?","a":"Had we confined ourselves to safe bets alone, we would have enjoyed a comfortable year and forfeited the breakthrough that ultimately reset our direction."},
  {"q":"What is the risk of an all-experiment portfolio?","a":"Had the portfolio remained entirely exploratory, we would have had an exhilarating year and nothing whatever to show for it."},
  {"q":"Describe a project you should have stopped sooner.","a":"Had we discontinued that initiative when the evidence first turned, we would have spared the budget a wholly avoidable loss."},
  {"q":"Why does portfolio balance matter to outcomes?","a":"Had we neglected the ratio between workhorses and moonshots, the year would have skewed toward novelty and away from delivery."},
  {"q":"What did tracking the portfolio actually buy you?","a":"Had we not tracked it with discipline, that expensive lesson would have surfaced far later, by which point it would have cost considerably more."},
  {"q":"How would you defend an apparent 'failure' in the mix?","a":"I would argue that, had we taken no exploratory risk at all, the new direction we now pursue would never have come into view."}]}
]

# ---------------------------------------------------------------------------
# 531 — Automation and Transformation as Strategy — Nominalisation
# ---------------------------------------------------------------------------
data["531"] = [
 {"title":"Open cloze (avançado) — Nominalização (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"The transformation ___ our core processes is now a board-level commitment.","a":"of"},
  {"q":"The difference ___ how the company competes hinges on disciplined automation.","a":"in"},
  {"q":"Any modernisation undertaken ___ a clear framing tends to consume effort and yield little.","a":"without"},
  {"q":"The framing ___ automation as strategy, not cost-cutting, changed the mandate.","a":"of"},
  {"q":"There is a risk ___ political interference distorting otherwise sound priorities.","a":"of"},
  {"q":"The acceleration ___ legacy workflows is rarely as simple as a new interface suggests.","a":"of"},
  {"q":"The temptation to leave well-functioning systems ___ alone is often the wiser course.","a":""},
  {"q":"The consumption ___ enormous effort by superficial change is a recurring trap.","a":"of"},
  {"q":"The decision rests on the distinction ___ modernising and merely re-skinning.","a":"between"},
  {"q":"The speeding-up ___ a broken process only produces failure faster.","a":"of"}]},
 {"title":"Key word transformation — mantenha o sentido (nominalização)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"We are transforming our core processes deliberately.  ·  (TRANSFORMATION)  ·  The ___ is deliberate.","a":"transformation of our core processes"},
  {"q":"How the company competes is changing.  ·  (DIFFERENCE)  ·  There is a ___ the company competes.","a":"difference in how"},
  {"q":"We framed automation as strategy, which changed everything.  ·  (FRAMING)  ·  The ___ as strategy changed everything.","a":"framing of automation"},
  {"q":"Politics interfered, and that distorted the priorities.  ·  (INTERFERENCE)  ·  The ___ distorted the priorities.","a":"political interference"},
  {"q":"We modernised without a clear plan, so effort was wasted.  ·  (MODERNISATION)  ·  An unplanned ___ wasted effort.","a":"modernisation"},
  {"q":"Speeding up a broken process just fails faster.  ·  (ACCELERATION)  ·  The ___ a broken process accelerates failure.","a":"acceleration of"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando nominalização.","items":[
  {"q":"We're changing how our core processes work.","a":"The transformation of our core processes is now under way."},
  {"q":"How we compete is genuinely different now.","a":"The difference in how the company competes is now strategically material."},
  {"q":"Once we framed automation as strategy, the mandate changed.","a":"The reframing of automation as strategy, rather than cost-cutting, transformed the mandate."},
  {"q":"Politics got in the way and messed up the priorities.","a":"Political interference distorted what would otherwise have been a coherent set of priorities."},
  {"q":"If you speed up a broken process, it just fails faster.","a":"The acceleration of a flawed process merely hastens the failure it was meant to resolve."},
  {"q":"Sometimes it's smarter to leave good systems alone.","a":"The decision to leave well-functioning systems untouched is frequently the more disciplined one."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"The transformation from our core processes is under way.","a":"The transformation of our core processes is under way. (nominalização: 'transformation of')"},
  {"q":"There is a difference on how the company competes.","a":"There is a difference in how the company competes. ('difference in', não 'difference on')"},
  {"q":"The framing of automation like strategy changed the mandate.","a":"The framing of automation as strategy changed the mandate. ('frame X as Y', não 'like')"},
  {"q":"The acceleration of a broken process only produce failure faster.","a":"The acceleration of a broken process only produces failure faster. (sujeito singular: 'produces')"},
  {"q":"There is a risk of political interference to distort priorities.","a":"There is a risk of political interference distorting priorities. (após 'risk of', use gerúndio)"},
  {"q":"The modernisation without a clear framing consume enormous effort.","a":"Modernisation without a clear framing consumes enormous effort. (concordância e artigo: 'consumes')"}]},
 {"title":"Advanced collocations & lexis — automação e transformação (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"a digital transformation","a":"uma transformação digital"},
  {"q":"to pave the cow paths","a":"automatizar processos ruins tal como estão"},
  {"q":"to re-engineer a process","a":"reengenheirar um processo"},
  {"q":"low-hanging fruit","a":"ganhos fáceis e imediatos"},
  {"q":"to lift and shift","a":"migrar sem redesenhar"},
  {"q":"to be transformative","a":"ser transformador"},
  {"q":"incremental change","a":"mudança incremental"},
  {"q":"to retire manual steps","a":"eliminar etapas manuais"},
  {"q":"a step-change in efficiency","a":"um salto de eficiência"},
  {"q":"to scale automation","a":"escalar a automação"}]},
 {"title":"Discuss / Argue — nominalização no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Is automation a cost question or a strategy question?","a":"In my view the reframing of automation as strategy, rather than cost reduction, is precisely what unlocks its competitive value."},
  {"q":"What is the danger of transformation without framing?","a":"The principal danger is the consumption of enormous effort by superficial change, leaving the underlying process untouched."},
  {"q":"When is it wiser not to modernise?","a":"The discipline lies in recognising that the preservation of a well-functioning system is frequently more valuable than its modernisation."},
  {"q":"How does automation change how you compete?","a":"The difference in how we compete derives less from the technology itself than from the deliberate redesign of the processes beneath it."},
  {"q":"What role does politics play in transformation?","a":"The intrusion of political interference into prioritisation is the surest way to convert a coherent programme into a portfolio of pet projects."},
  {"q":"What is the risk of speeding up a flawed process?","a":"The acceleration of a flawed process produces nothing but failure at greater speed, which is why redesign must precede automation."}]}
]

# ---------------------------------------------------------------------------
# 532 — AI Ethics as Executive Responsibility — Complex subordination
# ---------------------------------------------------------------------------
data["532"] = [
 {"title":"Open cloze (avançado) — Subordinação complexa (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"___ the technical teams can build controls, the judgement must live with the leaders.","a":"Although"},
  {"q":"Accountability cannot be delegated, ___ comfortable that might be for the executive.","a":"however"},
  {"q":"___ that a model affects real people, its logic must be explicable in plain words.","a":"Provided"},
  {"q":"Leaders remain responsible ___ they personally wrote the algorithm or not.","a":"whether"},
  {"q":"___ a system treats anyone unfairly, the leader who approved it answers for it.","a":"If / Where / Wherever"},
  {"q":"The board must decide, ___ uncomfortable the trade-offs may be.","a":"however"},
  {"q":"___ the model is opaque, no executive should agree to deploy it.","a":"Where / If"},
  {"q":"Ethics cannot sit with engineers ___ the values being encoded are the company's own.","a":"when / since"},
  {"q":"___ much we automate, the moral choices remain irreducibly human.","a":"However"},
  {"q":"___ a decision goes public, the leader, not the model, will be held to account.","a":"Should / When / If"}]},
 {"title":"Key word transformation — mantenha o sentido (subordinação complexa)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"Engineers can build controls, but leaders must judge.  ·  (ALTHOUGH)  ·  ___ build controls, leaders must judge.","a":"Although engineers can"},
  {"q":"If a model affects people, its logic must be clear.  ·  (PROVIDED)  ·  Its logic must be clear ___ people.","a":"provided it affects"},
  {"q":"It doesn't matter who wrote it; the leader answers.  ·  (WHETHER)  ·  The leader answers ___ wrote it.","a":"whether or not they"},
  {"q":"No matter how uncomfortable, the board must decide.  ·  (HOWEVER)  ·  ___ , the board must decide.","a":"However uncomfortable it is"},
  {"q":"When a model is opaque, don't deploy it.  ·  (WHERE)  ·  ___ , it should not be deployed.","a":"Where a model is opaque"},
  {"q":"However much we automate, the moral choice stays human.  ·  (MUCH)  ·  ___ , the moral choice stays human.","a":"However much we automate"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando subordinação.","items":[
  {"q":"Engineers can build the controls, but leaders own the call.","a":"Although the technical teams can build the controls, the judgement must reside with the leadership."},
  {"q":"If a model affects real people, you have to explain it simply.","a":"Provided that a model affects real people, its reasoning must be explicable in plain language."},
  {"q":"It doesn't matter who coded it; the leader is accountable.","a":"Whether or not they wrote the algorithm, the approving leader remains accountable for it."},
  {"q":"No matter how hard the trade-offs are, the board has to decide.","a":"However uncomfortable the trade-offs, the decision must ultimately rest with the board."},
  {"q":"If a system is unfair to someone, the person who signed off answers.","a":"Where a system treats anyone unfairly, the leader who approved it must answer for the outcome."},
  {"q":"You can't hand ethics to the engineers.","a":"Ethics cannot be delegated to engineers, since the values being encoded are the company's own."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Although engineers can build controls, but leaders must judge.","a":"Although engineers can build controls, leaders must judge. ('although' já contrasta; remova 'but')"},
  {"q":"Provided that a model affects people, so its logic must be clear.","a":"Provided that a model affects people, its logic must be clear. (a principal não leva 'so')"},
  {"q":"The leader answers whether wrote it or not.","a":"The leader answers whether or not they wrote it. (faltava o sujeito 'they' na oração com 'whether')"},
  {"q":"However the trade-offs are uncomfortable, the board must decide.","a":"However uncomfortable the trade-offs are, the board must decide. ('however + adjetivo' antecipa-se ao sujeito)"},
  {"q":"Where a model is opaque, no executive should not deploy it.","a":"Where a model is opaque, no executive should deploy it. (dupla negação indevida)"},
  {"q":"Despite the technical teams can build controls, judgement is the leader's.","a":"Although the technical teams can build controls, judgement is the leader's. ('despite' não precede oração; use 'although')"}]},
 {"title":"Advanced collocations & lexis — ética de IA executiva (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to hold someone accountable","a":"responsabilizar alguém"},
  {"q":"the buck stops with","a":"a responsabilidade final é de"},
  {"q":"a black-box model","a":"um modelo caixa-preta"},
  {"q":"explainable AI","a":"IA explicável"},
  {"q":"to encode bias","a":"codificar viés"},
  {"q":"to abdicate responsibility","a":"abdicar da responsabilidade"},
  {"q":"a values-based judgement","a":"um julgamento baseado em valores"},
  {"q":"to stand behind a decision","a":"sustentar/responder por uma decisão"},
  {"q":"reputational exposure","a":"exposição reputacional"},
  {"q":"to draw a line","a":"estabelecer um limite"}]},
 {"title":"Discuss / Argue — subordinação complexa no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Who owns AI ethics in your organisation?","a":"Although the engineers build the safeguards, accountability for them must reside with the leadership, however convenient delegation might appear."},
  {"q":"Why must a model's logic be explicable?","a":"Provided that a model affects real people, its reasoning must be expressible in plain words, since opacity is no defence when a decision goes public."},
  {"q":"Can an executive disclaim a model they didn't build?","a":"Whether or not they wrote a line of the algorithm, the leader who approved its deployment answers for its consequences."},
  {"q":"How do you handle an uncomfortable ethical trade-off?","a":"However uncomfortable the trade-off, the choice cannot be passed downward; it must be confronted and owned at board level."},
  {"q":"When should an AI system simply not be deployed?","a":"Where a system cannot be explained or treats anyone unfairly, no executive should agree to deploy it, irrespective of its performance."},
  {"q":"What remains human even as automation grows?","a":"However much we automate, the moral choices remain irreducibly human, and that is precisely where executive responsibility begins."}]}
]

# ---------------------------------------------------------------------------
# 533 — Cybersecurity as Executive Discipline — Formal modals of necessity
# ---------------------------------------------------------------------------
data["533"] = [
 {"title":"Open cloze (avançado) — Modais formais de necessidade (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"It is essential that every executive ___ their role before the first hour of an incident.","a":"know / understand"},
  {"q":"It is critical that the response plan ___ rehearsed in calm times, not improvised in crisis.","a":"be"},
  {"q":"Security ___ to be led as a discipline, not relegated to a technical silo.","a":"has / needs"},
  {"q":"It is imperative that limits of authority ___ defined long before they are tested.","a":"be"},
  {"q":"Tabletop exercises ___ be run regularly if the organisation is to remain ready.","a":"must / should"},
  {"q":"It is vital that the org chart for an incident ___ understood by all concerned.","a":"be"},
  {"q":"Every leader ___ to rehearse the first hour until the response becomes instinctive.","a":"ought / needs"},
  {"q":"It is essential that no decision-maker ___ left guessing when an attack unfolds.","a":"be"},
  {"q":"The board ___ ensure that readiness is treated as a leadership obligation.","a":"must / should"},
  {"q":"It is critical that responsibilities ___ rehearsed together, not learned in isolation.","a":"be"}]},
 {"title":"Key word transformation — mantenha o sentido (modais de necessidade + subjuntivo)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"Everyone must know their role before an incident.  ·  (ESSENTIAL)  ·  It is essential ___ their role.","a":"that everyone know"},
  {"q":"We have to rehearse the plan when things are calm.  ·  (CRITICAL)  ·  It is critical ___ in calm times.","a":"that the plan be rehearsed"},
  {"q":"Limits of authority should be set in advance.  ·  (IMPERATIVE)  ·  It is imperative ___ in advance.","a":"that limits be defined"},
  {"q":"We must run tabletop exercises regularly.  ·  (RUN)  ·  Tabletop exercises ___ regularly.","a":"must be run"},
  {"q":"No one should be left guessing during an attack.  ·  (VITAL)  ·  It is vital ___ guessing.","a":"that no one be left"},
  {"q":"Leaders ought to rehearse the first hour.  ·  (NECESSARY)  ·  It is necessary ___ the first hour.","a":"for leaders to rehearse"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando modais de necessidade.","items":[
  {"q":"Everyone needs to know their job before things go wrong.","a":"It is essential that every executive understand their role before the first hour of an incident."},
  {"q":"We should practise the plan while things are calm.","a":"It is critical that the response plan be rehearsed in calm times rather than improvised under duress."},
  {"q":"Security shouldn't just be left to the tech people.","a":"Security must be led as an executive discipline, not relegated to a technical silo."},
  {"q":"You have to set who decides what before you need it.","a":"It is imperative that limits of authority be defined long before they are tested."},
  {"q":"We need to do these tabletop exercises often.","a":"Tabletop exercises must be conducted regularly if readiness is to be sustained."},
  {"q":"Nobody should be left guessing in a crisis.","a":"It is vital that no decision-maker be left guessing as an attack unfolds."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"It is essential that every executive knows their role.","a":"It is essential that every executive know their role. (após 'essential that', subjuntivo: forma base 'know')"},
  {"q":"It is critical the plan be rehearsed in calm times.","a":"It is critical that the plan be rehearsed in calm times. (registro formal exige 'that')"},
  {"q":"Security must to be led as a discipline.","a":"Security must be led as a discipline. (modal 'must' não leva 'to')"},
  {"q":"It is imperative that limits are defined in advance.","a":"It is imperative that limits be defined in advance. (subjuntivo passivo: 'be defined')"},
  {"q":"Tabletop exercises must be ran regularly.","a":"Tabletop exercises must be run regularly. (particípio: 'run')"},
  {"q":"It is vital that no decision-maker is left guessing.","a":"It is vital that no decision-maker be left guessing. (subjuntivo: 'be left')"}]},
 {"title":"Advanced collocations & lexis — cibersegurança executiva (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"an incident response plan","a":"um plano de resposta a incidentes"},
  {"q":"the chain of command","a":"a cadeia de comando"},
  {"q":"to contain a breach","a":"conter uma violação"},
  {"q":"a war-game / tabletop","a":"um exercício simulado de crise"},
  {"q":"to escalate appropriately","a":"escalar adequadamente"},
  {"q":"to harden the perimeter","a":"reforçar o perímetro"},
  {"q":"the attack surface","a":"a superfície de ataque"},
  {"q":"to assume breach","a":"partir do princípio de que houve invasão"},
  {"q":"a single throat to choke","a":"um único responsável claro"},
  {"q":"to keep one's nerve","a":"manter a calma sob pressão"}]},
 {"title":"Discuss / Argue — modais de necessidade no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Why should cybersecurity be led, not delegated?","a":"It is essential that security be treated as an executive discipline, since a crisis exposes leadership decisions long before it exposes technical ones."},
  {"q":"What must happen before an incident, not during one?","a":"It is critical that the response plan be rehearsed in calm times, for nothing reliable can be improvised in the first hour of an attack."},
  {"q":"How do you ensure clear authority in a breach?","a":"It is imperative that the limits of each role be defined and rehearsed together, so that no decision-maker is left guessing when it matters."},
  {"q":"What value do tabletop exercises offer leaders?","a":"It is vital that executives rehearse the first hour repeatedly, until the response becomes instinctive rather than improvised."},
  {"q":"Whose responsibility is readiness, ultimately?","a":"The board must own readiness as a leadership obligation; it cannot be quietly devolved to a technical silo and forgotten."},
  {"q":"How do you keep security from becoming a silo?","a":"It is essential that responsibilities be rehearsed across functions, so that security is understood as a shared discipline rather than someone else's problem."}]}
]

# ---------------------------------------------------------------------------
# 534 — Data Protection at Enterprise Scale — Advanced passive constructions
# ---------------------------------------------------------------------------
data["534"] = [
 {"title":"Open cloze (avançado) — Construções passivas avançadas (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"Every dataset is mapped, purposed and ___ to a clearly identified accountable owner.","a":"owned / assigned"},
  {"q":"Requests from individuals are answered ___ a single, authoritative source of truth.","a":"from"},
  {"q":"Retention rules are applied consistently, ___ they are enforced manually or automatically.","a":"whether"},
  {"q":"Cross-border transfers must be documented before they are ___ to proceed.","a":"permitted / allowed"},
  {"q":"What had been a patchwork of local rules is now ___ governed by a single spine.","a":"coherently"},
  {"q":"Nothing is left ___ guesswork where the lawful basis for processing is concerned.","a":"to"},
  {"q":"The programme is designed so that compliance is ___ in, not bolted on afterwards.","a":"built / baked"},
  {"q":"Personal data is processed only ___ a documented and defensible purpose.","a":"for / with"},
  {"q":"Where a regulator asks, the answer can be produced ___ delay from the data map.","a":"without"},
  {"q":"Decisions about data are no longer ___ on instinct; they are evidenced.","a":"based / made"}]},
 {"title":"Key word transformation — mantenha o sentido (passiva avançada)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"We map, purpose and assign an owner to every dataset.  ·  (MAPPED)  ·  Every dataset ___ and assigned an owner.","a":"is mapped, purposed"},
  {"q":"We answer individuals' requests from one source.  ·  (ANSWERED)  ·  Requests ___ a single source.","a":"are answered from"},
  {"q":"We document transfers before we allow them.  ·  (PERMITTED)  ·  Transfers are documented before they ___ .","a":"are permitted"},
  {"q":"A single spine now governs what was a patchwork.  ·  (GOVERNED)  ·  The patchwork ___ a single spine.","a":"is now governed by"},
  {"q":"We build compliance in rather than adding it later.  ·  (BUILT)  ·  Compliance ___ , not bolted on.","a":"is built in"},
  {"q":"We base decisions on evidence, not instinct.  ·  (BASED)  ·  Decisions ___ , not instinct.","a":"are based on evidence"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando passiva avançada.","items":[
  {"q":"We know what every dataset is for and who owns it.","a":"Every dataset is mapped, purposed and assigned to an accountable owner."},
  {"q":"When someone asks about their data, we answer from one place.","a":"Requests from individuals are answered from a single, authoritative source."},
  {"q":"We had a mess of local rules; now there's one framework.","a":"What had been a patchwork of local rules is now coherently governed by a single spine."},
  {"q":"We don't guess what data we can move abroad.","a":"Nothing is left to guesswork where cross-border transfers are concerned."},
  {"q":"Compliance is part of the design, not an add-on.","a":"Compliance is built into the programme rather than bolted on after the fact."},
  {"q":"We can show a regulator the answer straight away.","a":"Where a regulator enquires, the answer is produced without delay from the data map."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Every dataset is mapped, purposed and own.","a":"Every dataset is mapped, purposed and owned. (paralelismo de particípios: 'owned')"},
  {"q":"Requests from individuals are answered by a single source of truth.","a":"Requests from individuals are answered from a single source of truth. ('answered from' indica a origem, não o agente)"},
  {"q":"Transfers must be documented before they permitted to proceed.","a":"Transfers must be documented before they are permitted to proceed. (faltava 'are' na passiva)"},
  {"q":"Compliance is build in, not bolted on.","a":"Compliance is built in, not bolted on. (particípio: 'built')"},
  {"q":"The patchwork is now governed for a single spine.","a":"The patchwork is now governed by a single spine. (agente da passiva: 'by')"},
  {"q":"Nothing is leaved to guesswork in this programme.","a":"Nothing is left to guesswork in this programme. (particípio irregular: 'left')"}]},
 {"title":"Advanced collocations & lexis — proteção de dados em escala (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"a lawful basis for processing","a":"uma base legal para tratamento"},
  {"q":"data minimisation","a":"minimização de dados"},
  {"q":"privacy by design","a":"privacidade desde a concepção"},
  {"q":"a subject access request","a":"uma solicitação de acesso do titular"},
  {"q":"to maintain an audit trail","a":"manter uma trilha de auditoria"},
  {"q":"a data processing agreement","a":"um acordo de tratamento de dados"},
  {"q":"to demonstrate compliance","a":"comprovar conformidade"},
  {"q":"a single pane of glass","a":"uma visão única e centralizada"},
  {"q":"to withstand scrutiny","a":"resistir ao escrutínio"},
  {"q":"a defensible position","a":"uma posição sustentável"}]},
 {"title":"Discuss / Argue — passiva avançada no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"How is data governed across jurisdictions in your firm?","a":"Every dataset is mapped, purposed and assigned to an owner, so that what was once a patchwork is now governed coherently by a single spine."},
  {"q":"How do you handle an individual's data request?","a":"Such requests are answered from a single authoritative source, which means the response can be produced without delay and withstands scrutiny."},
  {"q":"What is your philosophy on compliance?","a":"Compliance is built into the programme by design rather than bolted on afterwards, so that it is demonstrable rather than merely asserted."},
  {"q":"How do you manage cross-border transfers?","a":"No transfer is permitted to proceed until its lawful basis has been documented, and nothing is left to guesswork."},
  {"q":"What changed when you replaced local rules with one framework?","a":"Decisions about data ceased to be made on instinct and are now evidenced from a coherent data map applied across every jurisdiction."},
  {"q":"How would you reassure a regulator?","a":"I would demonstrate that every processing activity is documented and purposed, so that any question can be answered from a single, defensible source."}]}
]

# ---------------------------------------------------------------------------
# 535 — Threat Intelligence and Readiness — Complex conditionals
# ---------------------------------------------------------------------------
data["535"] = [
 {"title":"Open cloze (avançado) — Condicionais complexas (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"Had we acted on the intelligence, we ___ have invested very differently.","a":"would"},
  {"q":"We did know about the attack pattern — we simply ___ not act on it.","a":"did"},
  {"q":"If the weak point ___ been addressed, the supplier-chain attack would have failed.","a":"had"},
  {"q":"Were we to treat intelligence as a thermometer ___ a forecast, we would misread it.","a":"rather than"},
  {"q":"Had the warning not been merely filed, the breach ___ well have been prevented.","a":"might / could"},
  {"q":"If we ___ explicitly named our weak points, we would be defending them now.","a":"had"},
  {"q":"Should another supplier-chain attack occur, we ___ now be far better prepared.","a":"would"},
  {"q":"Knowing of a threat changes nothing ___ the knowledge is acted upon.","a":"unless"},
  {"q":"Had readiness been treated as a discipline, we ___ not be reacting today.","a":"would"},
  {"q":"If the intelligence ___ been escalated, the board would have understood the exposure.","a":"had"}]},
 {"title":"Key word transformation — mantenha o sentido (condicionais complexas / mistas)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"We didn't act on the intelligence, so we invested badly.  ·  (ACTED)  ·  ___ on the intelligence, we would have invested better.","a":"Had we acted"},
  {"q":"We didn't fix the weak point, so the attack succeeded.  ·  (ADDRESSED)  ·  ___ , the attack would have failed.","a":"Had the weak point been addressed"},
  {"q":"We filed the warning, so the breach happened.  ·  (NOT)  ·  Had the warning ___ filed, the breach might have been prevented.","a":"not merely been"},
  {"q":"If another attack happens, we'll be ready now.  ·  (SHOULD)  ·  ___ another attack, we would be ready.","a":"Should there be"},
  {"q":"Knowing a threat is useless if you don't act.  ·  (UNLESS)  ·  Knowledge changes nothing ___ .","a":"unless it is acted on"},
  {"q":"We didn't escalate it, so the board missed the exposure.  ·  (ESCALATED)  ·  Had it ___ , the board would have grasped the exposure.","a":"been escalated"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando condicionais.","items":[
  {"q":"We knew the risk and just didn't do anything about it.","a":"Had we acted on the intelligence we already possessed, our investment would have looked entirely different."},
  {"q":"If we'd fixed the weak point, the attack wouldn't have worked.","a":"Had the weak point been addressed in time, the supplier-chain attack would have failed."},
  {"q":"The warning was filed and forgotten, so the breach happened.","a":"Had the warning not been merely filed and forgotten, the breach might well have been prevented."},
  {"q":"Intelligence is useless unless you act on it.","a":"Threat intelligence changes nothing unless it is acted upon; knowledge alone is no defence."},
  {"q":"If something like this happens again, we'll be far readier.","a":"Should a comparable attack recur, we would now be considerably better prepared."},
  {"q":"We treated the intelligence like a forecast instead of a thermometer.","a":"Were we to read intelligence as a forecast rather than a thermometer, we would systematically misjudge our exposure."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Had we acted on the intelligence, we would invested differently.","a":"Had we acted on the intelligence, we would have invested differently. (condicional perfeito: 'would have invested')"},
  {"q":"If the weak point would have been addressed, the attack would have failed.","a":"If the weak point had been addressed, the attack would have failed. (oração 'if' usa 'had been', não 'would have')"},
  {"q":"Knowing a threat changes nothing without we act on it.","a":"Knowing a threat changes nothing unless we act on it. (use 'unless' + oração, não 'without' + sujeito)"},
  {"q":"Had readiness been a discipline, we would not reacting today.","a":"Had readiness been a discipline, we would not be reacting today. (condicional misto: 'would not be reacting')"},
  {"q":"Should another attack occurs, we would be better prepared.","a":"Should another attack occur, we would be better prepared. (após 'should' invertido, forma base 'occur')"},
  {"q":"If the intelligence had escalated, the board would have understood.","a":"If the intelligence had been escalated, the board would have understood. (passiva: 'had been escalated')"}]},
 {"title":"Advanced collocations & lexis — inteligência de ameaças (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to stay ahead of the threat","a":"antecipar-se à ameaça"},
  {"q":"an early-warning signal","a":"um sinal de alerta precoce"},
  {"q":"to act on intelligence","a":"agir com base na inteligência"},
  {"q":"a known vulnerability","a":"uma vulnerabilidade conhecida"},
  {"q":"to close the gap","a":"fechar a lacuna"},
  {"q":"a threat actor","a":"um agente de ameaça"},
  {"q":"to be caught flat-footed","a":"ser pego desprevenido"},
  {"q":"to triage the alerts","a":"triar os alertas"},
  {"q":"a dwell time","a":"tempo de permanência do invasor não detectado"},
  {"q":"to connect the dots","a":"conectar os pontos"}]},
 {"title":"Discuss / Argue — condicionais complexas no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Describe a threat you knew about but failed to act on.","a":"Had we acted on the intelligence we already held, we would have invested differently and the exposure would never have materialised."},
  {"q":"Why is intelligence worthless without action?","a":"Knowledge changes nothing unless it is acted upon; the breach occurred not because we were blind but because the warning was merely filed."},
  {"q":"How should leaders read threat intelligence?","a":"Were we to treat it as a thermometer rather than a forecast, we would respond to the actual temperature of risk instead of guessing at the weather."},
  {"q":"What would you do differently with hindsight?","a":"Had the weak point been explicitly named and addressed, the supplier-chain attack would in all likelihood have failed outright."},
  {"q":"How prepared are you for a recurrence?","a":"Should a comparable attack occur today, we would be far better prepared, precisely because we have stopped filing intelligence and started rehearsing against it."},
  {"q":"What turns intelligence into readiness?","a":"Readiness emerges only when intelligence is escalated and acted upon; had we treated it as a discipline earlier, we would not be reacting now."}]}
]

# ---------------------------------------------------------------------------
# 536 — Security Policies as Culture — Abstract noun phrases
# ---------------------------------------------------------------------------
data["536"] = [
 {"title":"Open cloze (avançado) — Sintagmas nominais abstratos (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"The tone ___ the whole company is set less by policy than by what leaders quietly tolerate.","a":"of"},
  {"q":"The discipline ___ culture outlasts any document pinned to the intranet.","a":"of"},
  {"q":"The welcoming ___ small incident reports is what allows real problems to surface.","a":"of"},
  {"q":"A policy is mere decoration ___ it is reinforced by everyday behaviour.","a":"unless"},
  {"q":"The reluctance ___ report near-misses is itself a security risk.","a":"to"},
  {"q":"The clarity ___ language in a policy determines whether anyone actually follows it.","a":"of"},
  {"q":"The absence ___ punishment for honest reporting is what makes honesty possible.","a":"of"},
  {"q":"The reinforcement ___ good habits matters more than the writing of new rules.","a":"of"},
  {"q":"The quietness ___ the tone is precisely what gives it authority.","a":"of"},
  {"q":"The willingness ___ surface a weak password is a cultural achievement, not a technical one.","a":"to"}]},
 {"title":"Key word transformation — mantenha o sentido (sintagmas nominais abstratos)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"Leaders set the tone of the whole company.  ·  (TONE)  ·  The ___ is set by its leaders.","a":"tone of the whole company"},
  {"q":"Culture is disciplined, and that endures.  ·  (DISCIPLINE)  ·  The ___ endures beyond documents.","a":"discipline of culture"},
  {"q":"We welcome small incident reports, which helps.  ·  (WELCOMING)  ·  The ___ lets problems surface.","a":"welcoming of small reports"},
  {"q":"People are reluctant to report, which is risky.  ·  (RELUCTANCE)  ·  The ___ is itself a risk.","a":"reluctance to report"},
  {"q":"We don't punish honest reporting, so honesty survives.  ·  (ABSENCE)  ·  The ___ enables honesty.","a":"absence of punishment"},
  {"q":"The language is clear, so people follow the policy.  ·  (CLARITY)  ·  The ___ secures compliance.","a":"clarity of the language"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando sintagmas abstratos.","items":[
  {"q":"What leaders put up with sets the tone for everyone.","a":"The tone of the whole company is shaped by what its leaders quietly tolerate."},
  {"q":"A culture that's disciplined lasts longer than any document.","a":"The discipline of culture outlasts any policy committed to paper."},
  {"q":"Welcoming small reports is how the real issues come out.","a":"The welcoming of small incident reports is precisely what allows the serious ones to surface."},
  {"q":"A policy nobody reinforces is just decoration.","a":"A policy unreinforced by everyday behaviour amounts to little more than decoration."},
  {"q":"People won't report if they fear being punished.","a":"The fear of punishment is the surest suppressor of honest reporting."},
  {"q":"Clear wording is what makes a policy actually work.","a":"The clarity of the language determines whether a policy is observed or ignored."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"The tone from the whole company is set by its leaders.","a":"The tone of the whole company is set by its leaders. (sintagma abstrato: 'tone of')"},
  {"q":"The welcoming of small reports allow problems to surface.","a":"The welcoming of small reports allows problems to surface. (sujeito singular 'welcoming': 'allows')"},
  {"q":"The reluctance of reporting near-misses is a risk.","a":"The reluctance to report near-misses is a risk. ('reluctance to + verbo', não 'of + -ing')"},
  {"q":"A policy is decoration except it is reinforced.","a":"A policy is decoration unless it is reinforced. (use 'unless', não 'except')"},
  {"q":"The discipline of culture outlast any document.","a":"The discipline of culture outlasts any document. (concordância: 'outlasts')"},
  {"q":"The absence of punishment for honest reporting make honesty possible.","a":"The absence of punishment for honest reporting makes honesty possible. (sujeito singular 'absence': 'makes')"}]},
 {"title":"Advanced collocations & lexis — cultura de segurança (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to set the tone from the top","a":"dar o tom a partir da liderança"},
  {"q":"a no-blame culture","a":"uma cultura sem culpabilização"},
  {"q":"to embed a behaviour","a":"enraizar um comportamento"},
  {"q":"a near-miss report","a":"um relato de quase-incidente"},
  {"q":"to walk the talk","a":"praticar o que se prega"},
  {"q":"a tick-box exercise","a":"um mero cumprimento formal de checklist"},
  {"q":"to normalise reporting","a":"normalizar a notificação de falhas"},
  {"q":"to lead by example","a":"liderar pelo exemplo"},
  {"q":"the human firewall","a":"o firewall humano"},
  {"q":"to lower the barrier to speaking up","a":"reduzir a barreira para se manifestar"}]},
 {"title":"Discuss / Argue — sintagmas abstratos no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Why are security policies really about culture?","a":"Because the discipline of culture outlasts any document, a policy is only as strong as the everyday behaviour that reinforces it."},
  {"q":"How do you encourage people to report problems?","a":"The welcoming of small incident reports, free of punishment, is precisely what allows the serious problems to surface before they escalate."},
  {"q":"What role do leaders play in security culture?","a":"The tone of the whole company is set by what its leaders quietly tolerate, which makes their personal example more eloquent than any memo."},
  {"q":"Why do written policies so often fail?","a":"A policy unreinforced by behaviour becomes mere decoration; the absence of lived discipline empties even the clearest wording of authority."},
  {"q":"What makes honest reporting possible?","a":"The absence of punishment for honest reporting is the cultural precondition for it; people surface weaknesses only where candour is met with curiosity rather than blame."},
  {"q":"How would you change a weak security culture?","a":"I would begin not with new rules but with the reinforcement of good habits and the welcoming of small reports, since culture, not documentation, is the true control."}]}
]

# ---------------------------------------------------------------------------
# 537 — IT Support as Senior Communication — Cleft sentences
# ---------------------------------------------------------------------------
data["537"] = [
 {"title":"Open cloze (avançado) — Orações clivadas (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"___ matters in a support exchange is not the fix but the tone it is delivered in.","a":"What"},
  {"q":"It is the small interactions ___ silently shape how a senior leader is perceived.","a":"that"},
  {"q":"___ a hurried request can do is set an impatient tone for the whole exchange.","a":"What"},
  {"q":"It is precisely in these unremarkable moments ___ character is revealed.","a":"that"},
  {"q":"___ I try to remember is that the person on the other end is a colleague, not a ticket.","a":"What"},
  {"q":"It was the vagueness of the request, ___ the request itself, that caused the delay.","a":"not / rather than"},
  {"q":"The thing ___ leaves the deepest impression is courtesy under mild frustration.","a":"that"},
  {"q":"___ a slightly entitled message signals is something the whole team notices.","a":"What"},
  {"q":"It is how we behave when nothing is at stake ___ defines us.","a":"that"},
  {"q":"All ___ it takes to set a respectful tone is a clear, patient first message.","a":"that"}]},
 {"title":"Key word transformation — mantenha o sentido (cleft)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"The tone matters more than the fix.  ·  (WHAT)  ·  ___ is the tone, not the fix.","a":"What matters most"},
  {"q":"Small interactions shape how leaders are seen.  ·  (IT)  ·  ___ how leaders are seen.","a":"It is small interactions that shape"},
  {"q":"I try to remember they're a colleague, not a ticket.  ·  (WHAT)  ·  ___ is that they are a colleague.","a":"What I try to remember"},
  {"q":"The vagueness, not the request, caused the delay.  ·  (IT)  ·  ___ caused the delay.","a":"It was the vagueness that"},
  {"q":"Courtesy under frustration leaves the deepest mark.  ·  (THING)  ·  The ___ is courtesy under frustration.","a":"thing that leaves the deepest mark"},
  {"q":"How we behave when nothing's at stake defines us.  ·  (IT)  ·  ___ defines us.","a":"It is how we behave that"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando cleft.","items":[
  {"q":"The tone is what counts, not the actual fix.","a":"What matters in a support exchange is not the fix but the tone in which it is delivered."},
  {"q":"These little moments quietly shape how people see you.","a":"It is the small, unremarkable interactions that silently shape how a leader is perceived."},
  {"q":"I remind myself they're a person, not a ticket.","a":"What I try to keep in mind is that the person on the other end is a colleague, not a ticket."},
  {"q":"It wasn't the request; it was how vague it was.","a":"It was the vagueness of the request, rather than the request itself, that caused the delay."},
  {"q":"How you act when nothing's at stake says the most.","a":"It is how we conduct ourselves when nothing is at stake that ultimately defines us."},
  {"q":"A slightly entitled message gets noticed by everyone.","a":"What a faintly entitled message signals is something the whole team quietly registers."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"What matters in a support exchange are the tone and the manner.","a":"What matters in a support exchange is the tone and the manner. (cleft com 'what' leva verbo singular)"},
  {"q":"It is the small interactions which shape perception, isn't it?","a":"It is the small interactions that shape perception. (registro formal evita question tag; preferir 'that')"},
  {"q":"It was the vagueness of the request what caused the delay.","a":"It was the vagueness of the request that caused the delay. (cleft usa 'that', não 'what')"},
  {"q":"What I try to remember is that the person are a colleague.","a":"What I try to remember is that the person is a colleague. (concordância: 'the person is')"},
  {"q":"Is how we behave that defines us.","a":"It is how we behave that defines us. (cleft exige 'It' introdutório)"},
  {"q":"All that it takes are a clear, patient message.","a":"All that it takes is a clear, patient message. (sujeito singular 'message': 'is')"}]},
 {"title":"Advanced collocations & lexis — comunicação no suporte (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to set the right tone","a":"estabelecer o tom certo"},
  {"q":"to come across as","a":"passar a impressão de"},
  {"q":"grace under pressure","a":"elegância sob pressão"},
  {"q":"to give the benefit of the doubt","a":"dar o benefício da dúvida"},
  {"q":"a measured response","a":"uma resposta comedida"},
  {"q":"to treat someone with courtesy","a":"tratar alguém com cortesia"},
  {"q":"to leave a lasting impression","a":"deixar uma impressão duradoura"},
  {"q":"to be unfailingly polite","a":"ser invariavelmente educado"},
  {"q":"a small kindness","a":"uma pequena gentileza"},
  {"q":"to read the room","a":"ler o ambiente/a situação"}]},
 {"title":"Discuss / Argue — clivadas no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Why treat an IT support request as senior communication?","a":"What a brief support exchange reveals is not technical detail but character, and it is in such unremarkable moments that a leader's reputation is quietly built."},
  {"q":"How do you frame a request to the service desk?","a":"What I aim for is a clear, patient first message, since it is the vagueness of a request, far more than its difficulty, that creates friction."},
  {"q":"What does courtesy under minor frustration signal?","a":"It is precisely how we behave when nothing of consequence is at stake that the wider team reads as the truest measure of us."},
  {"q":"Why does tone matter more than the fix?","a":"What endures after the ticket is closed is not the resolution but the manner in which it was sought and delivered."},
  {"q":"How do you avoid sounding entitled in a request?","a":"What I keep in mind is that the person reading it is a colleague rather than a ticket, which reliably softens both my wording and my expectations."},
  {"q":"What small habit improves how you are perceived?","a":"It is the habit of treating every minor interaction with the same courtesy as a major one that, over time, defines how seriously others take me."}]}
]

# ---------------------------------------------------------------------------
# 538 — Productivity and Digital Hygiene at Scale — Formal passive constructions
# ---------------------------------------------------------------------------
data["538"] = [
 {"title":"Open cloze (avançado) — Construções passivas formais (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"Default settings are rarely chosen deliberately; they are simply ___ and never revisited.","a":"inherited"},
  {"q":"The shape of our collective attention is ___ by defaults far more than by willpower.","a":"determined / governed"},
  {"q":"Focus time can be ___ in if meeting templates are designed with intent.","a":"built"},
  {"q":"Meetings are capped at fifty minutes so that recovery time is ___ into the day.","a":"built"},
  {"q":"Collective energy is too often ___ by a calendar nobody actually designed.","a":"consumed / drained"},
  {"q":"A rollout succeeds only when the new defaults are properly ___ to everyone.","a":"explained / communicated"},
  {"q":"Productivity is best treated as a design problem to be ___ , not a matter of discipline.","a":"solved"},
  {"q":"Defaults, once set, are seldom ___ until something forces a review.","a":"revisited / questioned"},
  {"q":"The day is ___ by templates that were inherited, not deliberately chosen.","a":"shaped / structured"},
  {"q":"Hygiene at scale is achieved when good behaviour is ___ in, not left to willpower.","a":"designed / engineered"}]},
 {"title":"Key word transformation — mantenha o sentido (passiva formal)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"Nobody deliberately chooses defaults; we just inherit them.  ·  (CHOSEN)  ·  Defaults ___ ; they are inherited.","a":"are rarely chosen deliberately"},
  {"q":"Defaults shape our attention more than willpower does.  ·  (DETERMINED)  ·  Our attention ___ defaults.","a":"is determined more by"},
  {"q":"We can build focus time into the templates.  ·  (BUILT)  ·  Focus time ___ the templates.","a":"can be built into"},
  {"q":"We cap meetings so the day gets recovery time.  ·  (CAPPED)  ·  Meetings ___ to protect recovery time.","a":"are capped"},
  {"q":"We should treat productivity as a design problem to solve.  ·  (SOLVED)  ·  Productivity is a problem to ___ .","a":"be solved by design"},
  {"q":"People rarely revisit defaults once they are set.  ·  (REVISITED)  ·  Defaults ___ once set.","a":"are seldom revisited"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando passiva.","items":[
  {"q":"We never really pick our defaults; we just inherit them.","a":"Defaults are rarely chosen deliberately; they are inherited and seldom revisited."},
  {"q":"Defaults run our attention way more than willpower does.","a":"The shape of our collective attention is governed by defaults far more than by individual willpower."},
  {"q":"We can design focus time into the meeting templates.","a":"Focus time can be built into the day if meeting templates are designed with intent."},
  {"q":"A new policy only works if you explain it to everyone.","a":"A rollout succeeds only when the new defaults are properly communicated to those affected."},
  {"q":"Productivity is a design issue, not a willpower issue.","a":"Productivity is best treated as a design problem to be solved rather than a matter of personal discipline."},
  {"q":"The calendar drains the team's energy, and no one chose it.","a":"Collective energy is consumed by a calendar that nobody actually designed."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Defaults are rarely chosen deliberate; they are inherited.","a":"Defaults are rarely chosen deliberately; they are inherited. (advérbio: 'deliberately')"},
  {"q":"Focus time can be build into the day.","a":"Focus time can be built into the day. (passiva exige particípio: 'built')"},
  {"q":"Our attention is determined for defaults, not willpower.","a":"Our attention is determined by defaults, not willpower. (agente da passiva: 'by')"},
  {"q":"Meetings are capped so recovery time gets build in.","a":"Meetings are capped so recovery time gets built in. (particípio: 'built')"},
  {"q":"Productivity should be treat as a design problem.","a":"Productivity should be treated as a design problem. (passiva: 'be treated')"},
  {"q":"Defaults, once set, are seldom revisit.","a":"Defaults, once set, are seldom revisited. (particípio: 'revisited')"}]},
 {"title":"Advanced collocations & lexis — produtividade e higiene digital (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to be on autopilot","a":"estar no piloto automático"},
  {"q":"deep work","a":"trabalho concentrado/profundo"},
  {"q":"a sensible default","a":"um padrão sensato"},
  {"q":"to ring-fence time","a":"reservar/proteger tempo"},
  {"q":"context switching","a":"troca de contexto"},
  {"q":"meeting hygiene","a":"higiene de reuniões"},
  {"q":"to declutter the inbox","a":"organizar/limpar a caixa de entrada"},
  {"q":"by default rather than by design","a":"por inércia em vez de por escolha"},
  {"q":"to reclaim the calendar","a":"recuperar o controle da agenda"},
  {"q":"a nudge","a":"um incentivo sutil"}]},
 {"title":"Discuss / Argue — passiva formal no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"Why is productivity a design problem rather than a willpower problem?","a":"Because the shape of our attention is governed by defaults rather than by resolve, durable change is achieved only when good behaviour is designed in."},
  {"q":"How do you protect focus time at scale?","a":"Focus time is built into the working day through deliberately designed templates, since time that is merely hoped for is invariably consumed by something else."},
  {"q":"What is wrong with inherited defaults?","a":"Defaults are rarely chosen deliberately; they are inherited and seldom revisited, which means the day is quietly shaped by decisions no one actually made."},
  {"q":"How would you reform meeting culture?","a":"Meetings would be capped and spaced so that recovery time is built into the calendar, rather than left to the willpower of exhausted individuals."},
  {"q":"What does digital hygiene at enterprise scale require?","a":"It requires that good defaults be designed and communicated, since hygiene that depends on each person's discipline does not survive contact with a busy week."},
  {"q":"Why do rollouts of new norms often fail?","a":"A rollout succeeds only when the new defaults are properly explained and embedded; where they are merely announced, the old behaviour quietly reasserts itself."}]}
]

# ---------------------------------------------------------------------------
# 539 — Remote and Hybrid Leadership — Complex subordination
# ---------------------------------------------------------------------------
data["539"] = [
 {"title":"Open cloze (avançado) — Subordinação complexa (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"___ the tools matter, the deeper work of hybrid leadership is cultural.","a":"Although"},
  {"q":"___ that leaders write the habits down, the team can thrive at a distance.","a":"Provided"},
  {"q":"Trust fragments ___ it is deliberately and intentionally rebuilt.","a":"unless"},
  {"q":"___ co-located teams rely on corridor chat, remote teams must engineer connection.","a":"Whereas"},
  {"q":"___ much is automated, the implicit habits of an office do not transfer themselves.","a":"However"},
  {"q":"The culture will erode ___ someone makes the implicit explicit.","a":"unless"},
  {"q":"___ remote work is well led, it can outperform the office it replaced.","a":"When / If / Where"},
  {"q":"___ the trend toward hybrid is irreversible, the practices remain immature.","a":"Although / While"},
  {"q":"Connection happens accidentally in person, ___ it must be intentional online.","a":"whereas"},
  {"q":"___ leaders model the written habits, the rest of the team rarely adopts them.","a":"Unless"}]},
 {"title":"Key word transformation — mantenha o sentido (subordinação complexa)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"Tools matter, but the real work is cultural.  ·  (ALTHOUGH)  ·  ___ , the real work is cultural.","a":"Although the tools matter"},
  {"q":"If leaders write the habits down, the team thrives.  ·  (PROVIDED)  ·  The team thrives ___ down.","a":"provided leaders write the habits"},
  {"q":"Trust breaks unless you rebuild it on purpose.  ·  (UNLESS)  ·  Trust breaks ___ rebuilt.","a":"unless it is deliberately"},
  {"q":"In person connection just happens; online it must be planned.  ·  (WHEREAS)  ·  ___ , online it must be planned.","a":"Whereas in person it just happens"},
  {"q":"However automated things are, office habits don't transfer.  ·  (HOWEVER)  ·  ___ , office habits don't transfer.","a":"However automated things are"},
  {"q":"The culture erodes if no one makes habits explicit.  ·  (UNLESS)  ·  The culture erodes ___ explicit.","a":"unless someone makes habits"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando subordinação.","items":[
  {"q":"The tools help, but the hard part is the culture.","a":"Although the tools matter, the deeper challenge of hybrid leadership is cultural."},
  {"q":"If leaders write the habits down, the team does well remotely.","a":"Provided that leaders make the habits explicit in writing, the team can thrive at a distance."},
  {"q":"Trust falls apart if you don't rebuild it on purpose.","a":"Trust fragments unless it is deliberately and intentionally rebuilt."},
  {"q":"In an office you bump into people; online you have to plan it.","a":"Whereas a co-located team relies on incidental corridor chat, a remote team must engineer its connection."},
  {"q":"Office habits don't just move online by themselves.","a":"However sophisticated the tooling, the implicit habits of an office do not transfer themselves."},
  {"q":"Without leaders modelling it, no one writes anything down.","a":"Unless leaders model the written habits, the rest of the team rarely adopts them."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"Although the tools matter, but the real work is cultural.","a":"Although the tools matter, the real work is cultural. ('although' já contrasta; remova 'but')"},
  {"q":"Provided that leaders write the habits down, so the team thrives.","a":"Provided that leaders write the habits down, the team thrives. (a principal não leva 'so')"},
  {"q":"Trust fragments without it is deliberately rebuilt.","a":"Trust fragments unless it is deliberately rebuilt. (use 'unless' + oração, não 'without')"},
  {"q":"Whereas co-located teams use corridor chat, but remote teams must plan.","a":"Whereas co-located teams use corridor chat, remote teams must plan. ('whereas' já contrasta; remova 'but')"},
  {"q":"However much automated, office habits don't transfer.","a":"However automated things are, office habits don't transfer. ('however + adjetivo + sujeito + verbo')"},
  {"q":"Unless leaders model the habits, the team rarely don't adopt them.","a":"Unless leaders model the habits, the team rarely adopts them. (dupla negação indevida)"}]},
 {"title":"Advanced collocations & lexis — liderança remota e híbrida (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to make the implicit explicit","a":"tornar explícito o implícito"},
  {"q":"asynchronous working","a":"trabalho assíncrono"},
  {"q":"to over-communicate","a":"comunicar em excesso (deliberadamente)"},
  {"q":"a watercooler moment","a":"um momento de conversa informal"},
  {"q":"to default to writing","a":"adotar a escrita como padrão"},
  {"q":"presence is not productivity","a":"presença não é produtividade"},
  {"q":"to build psychological safety","a":"construir segurança psicológica"},
  {"q":"to bridge the distance","a":"superar a distância"},
  {"q":"proximity bias","a":"viés de proximidade"},
  {"q":"to set norms intentionally","a":"definir normas intencionalmente"}]},
 {"title":"Discuss / Argue — subordinação complexa no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"What is the real challenge of hybrid leadership?","a":"Although the tools are now mature, the deeper work remains cultural, since the implicit habits of an office do not transfer themselves online."},
  {"q":"How do you sustain trust in a remote team?","a":"Trust fragments unless it is deliberately rebuilt, which is why I insist that the habits we once took for granted be made explicit in writing."},
  {"q":"Why must remote connection be engineered?","a":"Whereas a co-located team relies on incidental corridor chat, a distributed team must engineer its connection intentionally, or it quietly erodes."},
  {"q":"What determines whether hybrid working succeeds?","a":"Provided that leaders model the written habits themselves, the team can thrive; where they do not, the culture fragments however good the technology."},
  {"q":"What surprised you about leading remotely?","a":"However sophisticated our tooling became, I learned that connection which happens accidentally in person must be made deliberate online."},
  {"q":"How do you guard against proximity bias?","a":"Unless visibility is decoupled from physical presence, the office-based are quietly advantaged, which is why I evaluate contribution rather than attendance."}]}
]

# ---------------------------------------------------------------------------
# 540 — IT Leadership and the Business — Rhetorical closing devices
# ---------------------------------------------------------------------------
data["540"] = [
 {"title":"Open cloze (avançado) — Recursos retóricos de fechamento (information-technology)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
  {"q":"The systems are the business. The data is the business. The networks ___ the tools are how it works.","a":"and"},
  {"q":"This is not about separation; it is about ___ : IT leadership is business leadership.","a":"unity / integration"},
  {"q":"We make the business possible, we make it secure, ___ we make it scale.","a":"and"},
  {"q":"Not the specialist, not the engineer, ___ the leader who joins the trade-offs to the strategy.","a":"but"},
  {"q":"It works quietly, it works invisibly, and it works ___ day, every day.","a":"every"},
  {"q":"The architecture is not a thing apart; it ___ the very shape of the company.","a":"is"},
  {"q":"To lead IT well is to lead the business — ___ more, nothing less.","a":"nothing"},
  {"q":"What we protect is not data alone ___ the trust the business is built upon.","a":"but"},
  {"q":"The work is invisible, the stakes are total, ___ the responsibility is ours.","a":"and"},
  {"q":"In the end, the technology is not separate from the business; it ___ the business.","a":"is"}]},
 {"title":"Key word transformation — mantenha o sentido (recursos retóricos)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
  {"q":"IT isn't separate from the business; it is the business.  ·  (NOT)  ·  This is ___ ; it is unity.","a":"not about separation"},
  {"q":"It's the leader, not the engineer, who joins it all.  ·  (BUT)  ·  Not the engineer ___ joins it all.","a":"but the leader who"},
  {"q":"Leading IT well means leading the business.  ·  (NOTHING)  ·  To lead IT well is to lead the business, ___ less.","a":"nothing more, nothing"},
  {"q":"We make it possible, secure and scalable.  ·  (AND)  ·  We make it possible, we make it secure, ___ scale.","a":"and we make it"},
  {"q":"We protect data and, above all, trust.  ·  (BUT)  ·  We protect not data alone ___ .","a":"but the trust beneath it"},
  {"q":"The architecture is the very shape of the company.  ·  (IS)  ·  The architecture ___ the company.","a":"is the very shape of"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando recursos de fechamento (tríade, contraste, frase final medida).","items":[
  {"q":"IT runs everything, so it really is the business.","a":"The systems are the business; the data is the business; the networks and the tools are how the business works every day."},
  {"q":"It's not the techie, it's the leader who connects it to strategy.","a":"Not the specialist, nor the engineer, but the leader is the one who joins the trade-offs to the strategy."},
  {"q":"Leading IT well is just leading the business.","a":"To lead IT well is to lead the business — nothing more, and nothing less."},
  {"q":"We make the company work, keep it safe, and help it grow.","a":"We make the business possible, we make it secure, and we make it scale."},
  {"q":"We're really protecting trust, not just data.","a":"What we protect is not data alone but the trust upon which the entire business is built."},
  {"q":"The work is invisible but the responsibility is huge.","a":"The work is invisible, the stakes are total, and the responsibility is ours."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
  {"q":"The systems is the business; the data is the business.","a":"The systems are the business; the data is the business. (concordância: 'systems are')"},
  {"q":"Not the specialist, not the engineer, and the leader joins it.","a":"Not the specialist, not the engineer, but the leader joins it. (a tríade de contraste fecha com 'but', não 'and')"},
  {"q":"To lead IT well is leading the business.","a":"To lead IT well is to lead the business. (paralelismo do infinitivo: 'is to lead')"},
  {"q":"We make it possible, we make it secure, we make it to scale.","a":"We make it possible, we make it secure, we make it scale. ('make + objeto + verbo base': 'make it scale')"},
  {"q":"What we protect is not data alone and the trust beneath it.","a":"What we protect is not data alone but the trust beneath it. (correlação 'not X but Y')"},
  {"q":"The work is invisible, the stakes are total, the responsibility is ours, isn't it?","a":"The work is invisible, the stakes are total, and the responsibility is ours. (fechamento formal dispensa question tag)"}]},
 {"title":"Advanced collocations & lexis — liderança de TI como liderança de negócios (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
  {"q":"to bring it full circle","a":"fechar o ciclo / arrematar"},
  {"q":"a seat at the top table","a":"um lugar na mesa principal"},
  {"q":"to make the case compellingly","a":"defender a tese de forma convincente"},
  {"q":"the connective tissue of the business","a":"o tecido conectivo do negócio"},
  {"q":"to leave a lasting legacy","a":"deixar um legado duradouro"},
  {"q":"on a final note","a":"como nota final"},
  {"q":"to rise to the occasion","a":"estar à altura da ocasião"},
  {"q":"to be of a piece with","a":"estar em consonância com"},
  {"q":"a measured conclusion","a":"uma conclusão ponderada"},
  {"q":"to come down to this","a":"resumir-se a isto"}]},
 {"title":"Discuss / Argue — recursos de fechamento no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
  {"q":"How would you summarise the role of IT in one closing statement?","a":"In the end it comes down to this: the systems are the business, the data is the business, and the networks are how the business works every day."},
  {"q":"Who really leads IT — the engineer or the executive?","a":"Not the specialist, nor the engineer, but the leader is the one who joins the trade-offs to the strategy and answers for the result."},
  {"q":"How do you frame the value of IT to a board, in closing?","a":"We make the business possible, we make it secure, and we make it scale — that, and nothing less, is what IT leadership delivers."},
  {"q":"What is the deeper thing IT protects?","a":"What we protect is not data alone but the trust upon which the entire enterprise is built, and that responsibility is ours to carry."},
  {"q":"Why is IT leadership business leadership?","a":"Because the architecture is not a thing apart but the very shape of the company, to lead it well is to lead the business — nothing more, nothing less."},
  {"q":"How would you close a strategy presentation on IT?","a":"On a final note, the work is largely invisible, the stakes are total, and the responsibility sits squarely with us — which is precisely why it must be led, not merely managed."}]}
]

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)

print("written", len(data), "lessons")
