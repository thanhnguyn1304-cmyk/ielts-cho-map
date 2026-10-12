/* Cambridge IELTS 20 — Academic Listening & Reading */
IELTS.addBook({
  id: 20,
  title: "Cambridge IELTS 20",
  audioDir: "CAM IELTS 20/FILE AUDIO/",
  tests: [
    // ================= TEST 1 =================
    {
      n: 1,
      listening: {
        parts: [
          {
            title: "Restaurant recommendations",
            audio: "T1S1.m4a",
            groups: [
              {
                instr: "Questions 1–10<br>Complete the table below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<table class="grid">
<tr><th>Name of restaurant</th><th>Location</th><th>Reason for recommendation</th><th>Other comments</th></tr>
<tr>
  <td>The Junction</td>
  <td>Greyson Street, near the station</td>
  <td>Good for people who are especially keen on [[1]]</td>
  <td><ul><li>Quite expensive</li><li>The [[2]] is a good place for a drink</li></ul></td>
</tr>
<tr>
  <td>Paloma</td>
  <td>In Bow Street next to the cinema</td>
  <td>[[3]] food, good for sharing</td>
  <td><ul><li>Staff are very friendly</li><li>Need to pay £50 deposit</li><li>A limited selection of [[4]] food on the menu</li></ul></td>
</tr>
<tr>
  <td>The [[5]]</td>
  <td>At the top of a [[6]]</td>
  <td><ul><li>A famous chef</li><li>All the [[7]] are very good</li><li>Only uses [[8]] ingredients</li></ul></td>
  <td><ul><li>Set lunch costs £ [[9]] per person</li><li>Portions probably of [[10]] size</li></ul></td>
</tr>
</table>`
              }
            ]
          },
          {
            title: "Edelman Pottery",
            audio: "T1S2.m4a",
            groups: [
              {
                instr: "Questions 11–16<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                items: [
                  { q: 11, text: "Heather says pottery differs from other art forms because", options: ["it lasts longer in the ground.", "it is practised by more people.", "it can be repaired more easily."] },
                  { q: 12, text: "Archaeologists sometimes identify the use of ancient pottery from", options: ["the clay it was made with.", "the marks that are on it.", "the basic shape of it."] },
                  { q: 13, text: "Some people join Heather's pottery class because they want to", options: ["create an item that looks very old.", "find something that they are good at.", "make something that will outlive them."] },
                  { q: 14, text: "What does Heather value most about being a potter?", options: ["its calming effect", "its messy nature", "its physical benefits"] },
                  { q: 15, text: "Most of the visitors to Edelman Pottery", options: ["bring friends to join courses.", "have never made a pot before.", "try to learn techniques too quickly."] },
                  { q: 16, text: "Heather reminds her visitors that they should", options: ["put on their aprons.", "change their clothes.", "take off their jewellery."] }
                ]
              },
              {
                instr: "Questions 17 and 18<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [17, 18],
                text: "Which <b>TWO</b> things does Heather explain about kilns?",
                options: [
                  "what their function is",
                  "when they were invented",
                  "ways of keeping them safe",
                  "where to put one in your home",
                  "what some people use instead of one"
                ]
              },
              {
                instr: "Questions 19 and 20<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [19, 20],
                text: "Which <b>TWO</b> points does Heather make about a potter's tools?",
                options: [
                  "Some are hard to hold.",
                  "Some are worth buying.",
                  "Some are essential items.",
                  "Some have memorable names.",
                  "Some are available for use by participants."
                ]
              }
            ]
          },
          {
            title: "Loneliness and mental health",
            audio: "T1S3.m4a",
            groups: [
              {
                instr: "Questions 21 and 22<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [21, 22],
                text: "Which <b>TWO</b> things do the students both believe are responsible for the increase in loneliness?",
                options: [
                  "social media",
                  "smaller nuclear families",
                  "urban design",
                  "longer lifespans",
                  "a mobile workforce"
                ]
              },
              {
                instr: "Questions 23 and 24<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [23, 24],
                text: "Which <b>TWO</b> health risks associated with loneliness do the students agree are based on solid evidence?",
                options: [
                  "a weakened immune system",
                  "dementia",
                  "cancer",
                  "obesity",
                  "cardiovascular disease"
                ]
              },
              {
                instr: "Questions 25 and 26<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [25, 26],
                text: "Which <b>TWO</b> opinions do both the students express about the evolutionary theory of loneliness?",
                options: [
                  "It has little practical relevance.",
                  "It needs further investigation.",
                  "It is misleading.",
                  "It should be more widely accepted.",
                  "It is difficult to understand."
                ]
              },
              {
                instr: "Questions 27–30<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "Loneliness and mental health",
                items: [
                  { q: 27, text: "When comparing loneliness to depression, the students", options: ["doubt that there will ever be a medical cure for loneliness.", "claim that the link between loneliness and mental health is overstated.", "express frustration that loneliness is not taken more seriously."] },
                  { q: 28, text: "Why do the students decide to start their presentation with an example from their own experience?", options: ["to explain how difficult loneliness can be", "to highlight a situation that most students will recognise", "to emphasise that feeling lonely is more common for men than women"] },
                  { q: 29, text: "The students agree that talking to strangers is a good strategy for dealing with loneliness because", options: ["it creates a sense of belonging.", "it builds self-confidence.", "it makes people feel more positive."] },
                  { q: 30, text: "The students find it difficult to understand why solitude is considered to be", options: ["similar to loneliness.", "necessary for mental health.", "an enjoyable experience."] }
                ]
              }
            ]
          },
          {
            title: "Reclaiming urban rivers",
            audio: "T1S4.m4a",
            groups: [
              {
                instr: "Questions 31–40<br>Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Reclaiming urban rivers</h4>
<p><b>Historical background</b></p>
<ul>
  <li>Nearly all major cities were built on a river.</li>
  <li>Rivers were traditionally used by city dwellers for transport, fishing and recreation.</li>
  <li>Industrial development and rising populations later led to:
    <ul>
      <li>more sewage from houses being discharged into the river</li>
      <li>pollution from [[31]] on the river bank.</li>
    </ul>
  </li>
  <li>In 1957, the River Thames in London was declared biologically [[32]].</li>
</ul>
<p><b>Recent improvements</b></p>
<ul>
  <li>Seals and even a [[33]] have been seen in the River Thames.</li>
  <li>Riverside warehouses are converted to restaurants and [[34]].</li>
  <li>In Los Angeles, there are plans to:
    <ul>
      <li>build a riverside [[35]].</li>
      <li>display [[36]] projects.</li>
    </ul>
  </li>
  <li>In Paris, [[37]] are created on the sides of the river every summer.</li>
</ul>
<p><b>Transport possibilities</b></p>
<ul>
  <li>Over 2 billion passengers already travel by [[38]] in cities round the world.</li>
  <li>Changes in shopping habits mean the number of deliveries that are made is increasing.</li>
  <li>Instead of road transport, goods could be transported by large freight barges and electric [[39]] or, in future, by [[40]].</li>
</ul>`
              }
            ]
          }
        ],
        answers: {
          1: "fish", 2: "roof", 3: "Spanish", 4: "vegetarian", 5: "Audley", 6: "hotel", 7: "reviews", 8: "local", 9: "30|thirty", 10: "average",
          11: "A", 12: "B", 13: "C", 14: "A", 15: "B", 16: "C", 17: "A", 18: "E", 19: "C", 20: "E",
          21: "C", 22: "E", 23: "A", 24: "C", 25: "A", 26: "B", 27: "A", 28: "B", 29: "A", 30: "C",
          31: "factories", 32: "dead", 33: "whale", 34: "apartments", 35: "park", 36: "art", 37: "beaches", 38: "ferry", 39: "bikes", 40: "drone"
        }
      },
      reading: {
        passages: [
          {
            title: "The kākāpō",
            text: `<h3>The kākāpō</h3>
<p class="sub"><i>The kākāpō is a nocturnal, flightless parrot that is critically endangered and one of New Zealand's unique treasures</i></p>
<p>The kākāpō, also known as the owl parrot, is a large, forest-dwelling bird, with a pale owl-like face. Up to 64 cm in length, it has predominantly yellow-green feathers, forward-facing eyes, a large grey beak, large blue feet, and relatively short wings and tail. It is the world's only flightless parrot, and is also possibly one of the world's longest-living birds, with a reported lifespan of up to 100 years.</p>
<p>Kākāpō are solitary birds and tend to occupy the same home range for many years. They forage on the ground and climb high into trees. They often leap from trees and flap their wings, but at best manage a controlled descent to the ground. They are entirely vegetarian, with their diet including the leaves, roots and bark of trees as well as bulbs, and fern fronds.</p>
<p>Kākāpō breed in summer and autumn, but only in years when food is plentiful. Males play no part in incubation or chick-rearing — females alone incubate eggs and feed the chicks. The 1–4 eggs are laid in soil, which is repeatedly turned over before and during incubation. The female kākāpō has to spend long periods away from the nest searching for food, which leaves the unattended eggs and chicks particularly vulnerable to predators.</p>
<p>Before humans arrived, kākāpō were common throughout New Zealand's forests. However, this all changed with the arrival of the first Polynesian settlers about 700 years ago. For the early settlers, the flightless kākāpō was easy prey. They ate its meat and used its feathers to make soft cloaks. With them came the Polynesian dog and rat, which also preyed on kākāpō. By the time European colonisers arrived in the early 1800s, kākāpō had become confined to the central North Island and forested parts of the South Island. The fall in kākāpō numbers was accelerated by European colonisation. A great deal of habitat was lost through forest clearance, and introduced species such as deer depleted the remaining forests of food. Other predators such as cats, stoats and two more species of rat were also introduced. The kākāpō were in serious trouble.</p>
<p>In 1894, the New Zealand government launched its first attempt to save the kākāpō. Conservationist Richard Henry led an effort to relocate several hundred of the birds to predator-free Resolution Island in Fiordland. Unfortunately, the island didn't remain predator free — stoats arrived within six years, eventually destroying the kākāpō population. By the mid-1900s, the kākāpō was practically a lost species. Only a few clung to life in the most isolated parts of New Zealand.</p>
<p>From 1949 to 1973, the newly formed New Zealand Wildlife Service made over 60 expeditions to find kākāpō, focusing mainly on Fiordland. Six were caught, but there were no females amongst them and all but one died within a few months of captivity. In 1974, a new initiative was launched, and by 1977, 18 more kākāpō were found in Fiordland. However, there were still no females. In 1977, a large population of males was spotted in Rakiura — a large island free from stoats, ferrets and weasels. There were about 200 individuals, and in 1980 it was confirmed females were also present. These birds have been the foundation of all subsequent work in managing the species.</p>
<p>Unfortunately, predation by feral cats on Rakiura Island led to a rapid decline in kākāpō numbers. As a result, during 1980–97, the surviving population was evacuated to three island sanctuaries: Codfish Island, Maud Island and Little Barrier Island. However, breeding success was hard to achieve. Rats were found to be a major predator of kākāpō chicks and an insufficient number of chicks survived to offset adult mortality. By 1995, although at least 12 chicks had been produced on the islands, only three had survived. The kākāpō population had dropped to 51 birds. The critical situation prompted an urgent review of kākāpō management in New Zealand.</p>
<p>In 1996, a new Recovery Plan was launched, together with a specialist advisory group called the Kākāpō Scientific and Technical Advisory Committee and a higher amount of funding. Renewed steps were taken to control predators on the three islands. Cats were eradicated from Little Barrier Island in 1980, and possums were eradicated from Codfish Island by 1986. However, the population did not start to increase until rats were removed from all three islands, and the birds were more intensively managed. This involved moving the birds between islands, supplementary feeding of adults and rescuing and hand-raising any failing chicks.</p>
<p>After the first five years of the Recovery Plan, the population was on target. By 2000, five new females had been produced, and the total population had grown to 62 birds. For the first time, there was cautious optimism for the future of kākāpō and by June 2020, a total of 210 birds was recorded.</p>
<p>Today, kākāpō management continues to be guided by the kākāpō Recovery Plan. Its key goals are: minimise the loss of genetic diversity in the kākāpō population, restore or maintain sufficient habitat to accommodate the expected increase in the kākāpō population, and ensure stakeholders continue to be fully engaged in the preservation of the species.</p>`,
            groups: [
              {
                instr: "Questions 1–6<br>Do the following statements agree with the information given in Reading Passage 1?<br>In boxes 1–6 on your answer sheet, write<br><b>TRUE</b> if the statement agrees with the information<br><b>FALSE</b> if the statement contradicts the information<br><b>NOT GIVEN</b> if there is no information on this",
                type: "choice",
                choices: ["TRUE", "FALSE", "NOT GIVEN"],
                items: [
                  { q: 1, text: "There are other parrots that share the kakapo's inability to fly." },
                  { q: 2, text: "Adult kakapo produce chicks every year." },
                  { q: 3, text: "Adult male kakapo bring food back to nesting females." },
                  { q: 4, text: "The Polynesian rat was a greater threat to the kakapo than Polynesian settlers." },
                  { q: 5, text: "Kakapo were transferred from Rakiura Island to other locations because they were at risk from feral cats." },
                  { q: 6, text: "One Recovery Plan initiative that helped increase the kakapo population size was caring for struggling young birds." }
                ]
              },
              {
                instr: "Questions 7–13<br>Complete the notes below.<br>Choose <b>ONE WORD AND/OR A NUMBER</b> from the passage for each answer.",
                type: "html",
                html: `
<h4 class="center">New Zealand's kākāpō</h4>
<p><b>A type of parrot:</b></p>
<ul>
  <li>diet consists of fern fronds, various parts of a tree and [[7]]</li>
  <li>nests are created in [[8]] where eggs are laid.</li>
</ul>
<p><b>Arrival of Polynesian settlers</b></p>
<ul>
  <li>the [[9]] of the kākāpō were used to make clothes.</li>
</ul>
<p><b>Arrival of European colonisers</b></p>
<ul>
  <li>[[10]] were an animal which they introduced that ate the kākāpō's food sources.</li>
</ul>
<p><b>Protecting kākāpō</b></p>
<ul>
  <li>Richard Henry, a conservationist, tried to protect the kākāpō.</li>
  <li>a definite sighting of female kākāpō on Rakiura Island was reported in the year [[11]].</li>
  <li>the Recovery Plan included an increase in [[12]].</li>
  <li>a current goal of the Recovery Plan is to maintain the involvement of [[13]] in kākāpō protection.</li>
</ul>`
              }
            ]
          },
          {
            title: "Return of the elm",
            text: `<h3>Return of the elm</h3>
<p class="sub"><i>Mark Rowe investigates attempts to reintroduce elms to Britain</i></p>
<p><b>A</b> Around 25 million elms, accounting for 90% of all elm trees in the UK, died during the 1960s and '70s of Dutch elm disease. In the aftermath, the elm, once so dominant in the British landscape, was largely forgotten. However, there's now hope the elm may be reintroduced to the countryside of central and southern England. Any reintroduction will start from a very low base. 'The impact of the disease is difficult to picture if you hadn't seen what was there before,' says Matt Elliot of the Woodland Trust. 'You look at old photographs from the 1960s and it's only then that you realise the impact [elms had] ... They were significant, large trees ... then they were gone.'</p>
<p><b>B</b> The disease is caused by a fungus that blocks the elms' vascular (water, nutrient and food transport) system, causing branches to wilt and die. A first epidemic, which occurred in the 1920s, gradually died down, but in the '70s a second epidemic was triggered by shipments of elm from Canada. The wood came in the form of logs destined for boat building and its intact bark was perfect for the elm bark beetles that spread the deadly fungus. This time, the beetles carried a much more virulent strain that destroyed the vast majority of British elms.</p>
<p><b>C</b> Today, elms still exist in the southern English countryside but mostly only in low hedgerows between fields. 'We have millions of small elms in hedgerows but they get targeted by the beetle as soon as they reach a certain size,' says Karen Russell, co-author of the report 'Where we are with elm'. Once the trunk of the elm reaches 10–15 centimetres or so in diameter, it becomes a perfect size for beetles to lay eggs and for the fungus to take hold. Yet mature specimens have been identified, in counties such as Cambridgeshire, that are hundreds of years old, and have mysteriously escaped the epidemic.</p>
<p>The key, Russell says, is to identify and study those trees that have survived and work out why they stood tall when millions of others succumbed. Nevertheless, opportunities are limited as the number of these mature survivors is relatively small. 'What are the reasons for their survival?' asks Russell. 'Avoidance, tolerance, resistance? We don't know where the balance lies between the three. I don't see how it can be entirely down to luck.'</p>
<p><b>D</b> For centuries, elm ran a close second to oak as the hardwood tree of choice in Britain and was in many instances the most prominent tree in the landscape. Not only was elm common in European forests, it became a key component of birch, ash and hazel woodlands. The use of elm is thought to go back to the Bronze Age, when it was widely used for tools. Elm was also the preferred material for shields and early swords. In the 18th century, it was planted more widely and its wood was used for items such as storage crates and flooring. It was also suitable for items that experienced high levels of impact and was used to build the keel of the 19th-century sailing ship <i>Cutty Sark</i> as well as mining equipment.</p>
<p><b>E</b> Given how ingrained elm is in British culture, it's unsurprising the tree has many advocates. Amongst them is Peter Bourne of the National Elm Collection in Brighton. 'I saw Dutch elm disease unfold as a small boy,' he says. 'The elm seemed to be part of rural England, but I remember watching trees just lose their leaves and that really stayed with me.' Today, the city of Brighton's elms total about 17,000. Local factors appear to have contributed to their survival. Strong winds from the sea make it difficult for the determined elm bark beetle to attack this coastal city's elm population. However, the situation is precarious. 'The beetles can just march in if we're not careful, as the threat is right on our doorstep,' says Bourne.</p>
<p><b>F</b> Any prospect of the elm returning relies heavily on trees being either resistant to, or tolerant of, the disease. This means a widespread reintroduction would involve existing or new hybrid strains derived from resistant, generally non-native elm species. A new generation of seedlings have been bred and tested to see if they can withstand the fungus by cutting a small slit on the bark and injecting a tiny amount of the pathogen. 'The effects are very quick,' says Russell. 'You return in four to six weeks and trees that are resistant show no symptoms, whereas those that are susceptible show leaf loss and may even have died completely.'</p>
<p><b>G</b> All of this raises questions of social acceptance, acknowledges Russell. 'If we're putting elm back into the landscape, a small element of it is not native — are we bothered about that?' For her, the environmental case for reintroducing elm is strong. 'They will host wildlife, which is a good thing.' Others are more wary. 'On the face of it, it seems like a good idea,' says Elliot. The problem, he suggests, is that, 'You're replacing a native species with a horticultural analogue*. You're effectively cloning.' There's also the risk of introducing new diseases. Rather than plant new elms, the Woodland Trust emphasises providing space to those elms that have survived independently. 'Sometimes the best thing you can do is just give nature time to recover ... over time, you might get resistance,' says Elliot.</p>
<p><i>* horticultural analogue: a cultivated plant species that is genetically similar to an existing species</i></p>`,
            groups: [
              {
                instr: "Questions 14–18<br>Reading Passage 2 has seven sections, <b>A–G</b>.<br>Which section contains the following information?<br><i>NB You may use any letter more than once.</i>",
                type: "match",
                letters: "ABCDEFG",
                items: [
                  { q: 14, text: "reference to the research problems that arise from there being only a few surviving large elms" },
                  { q: 15, text: "details of a difference of opinion about the value of reintroducing elms to Britain" },
                  { q: 16, text: "reference to how Dutch elm disease was brought into Britain" },
                  { q: 17, text: "a description of the conditions that have enabled a location in Britain to escape Dutch elm disease" },
                  { q: 18, text: "reference to the stage at which young elms become vulnerable to Dutch elm disease" }
                ]
              },
              {
                instr: "Questions 19–23<br>Look at the following statements (Questions 19–23) and the list of people below.<br>Match each statement with the correct person, <b>A</b>, <b>B</b>, or <b>C</b>.<br><i>NB You may use any letter more than once.</i>",
                type: "match",
                boxTitle: "List of People",
                box: [
                  ["A", "Matt Elliot"],
                  ["B", "Karen Russell"],
                  ["C", "Peter Bourne"]
                ],
                items: [
                  { q: 19, text: "If a tree gets infected with Dutch elm disease, the damage rapidly becomes visible." },
                  { q: 20, text: "It may be better to wait and see if the mature elms that have survived continue to flourish." },
                  { q: 21, text: "There must be an explanation for the survival of some mature elms." },
                  { q: 22, text: "We need to be aware that insects carrying Dutch elm disease are not very far away." },
                  { q: 23, text: "You understand the effect Dutch elm disease has had when you see evidence of how prominent the tree once was." }
                ]
              },
              {
                instr: "Questions 24–26<br>Complete the summary below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<h4 class="center">Uses of a popular tree</h4>
<p>For hundreds of years, the only tree that was more popular in Britain than elm was [[24]]. Starting in the Bronze Age, many tools were made from elm and people also used it to make weapons. In the 18th century, it was grown to provide wood for boxes and [[25]]. Due to its strength, elm was often used for mining equipment and the <i>Cutty Sark</i>'s [[26]] was also constructed from elm.</p>`
              }
            ]
          },
          {
            title: "How stress affects our judgement",
            text: `<h3>How stress affects our judgement</h3>
<p>Some of the most important decisions of our lives occur while we're feeling stressed and anxious. From medical decisions to financial and professional ones, we are all sometimes required to weigh up information under stressful conditions. But do we become better or worse at processing and using information under such circumstances?</p>
<p>My colleague and I, both neuroscientists, wanted to investigate how the mind operates under stress, so we visited some local fire stations. Firefighters' workdays vary quite a bit. Some are pretty relaxed; they'll spend their time washing the truck, cleaning equipment, cooking meals and reading. Other days can be hectic, with numerous life-threatening incidents to attend to; they'll enter burning homes to rescue trapped residents, and assist with medical emergencies. These ups and downs presented the perfect setting for an experiment on how people's ability to use information changes when they feel under pressure.</p>
<p>We found that perceived threat acted as a trigger for a stress reaction that made the task of processing information easier for the firefighters — but only as long as it conveyed bad news.</p>
<p>This is how we arrived at these results. We asked the firefighters to estimate their likelihood of experiencing 40 different adverse events in their life, such as being involved in an accident or becoming a victim of card fraud. We then gave them either good news (that their likelihood of experiencing these events was lower than they'd thought) or bad news (that it was higher) and asked them to provide new estimates.</p>
<p>People are normally quite optimistic — they will ignore bad news and embrace the good. This is what happened when the firefighters were relaxed; but when they were under stress, a different pattern emerged. Under these conditions, they became hyper-vigilant to bad news, even when it had nothing to do with their job (such as learning that the likelihood of card fraud was higher than they'd thought), and altered their beliefs in response. In contrast, stress didn't change how they responded to good news (such as learning that the likelihood of card fraud was lower than they'd thought).</p>
<p>Back in our lab, we observed the same pattern in students who were told they had to give a surprise public speech, which would be judged by a panel, recorded and posted online. Sure enough, their cortisol levels spiked, their heart rates went up and they suddenly became better at processing unrelated, yet alarming, information about rates of disease and violence.</p>
<p>When we experience stressful events, a physiological change is triggered that causes us to take in warnings and focus on what might go wrong. Brain imaging reveals that this 'switch' is related to a sudden boost in a neural signal important for learning, specifically in response to unexpected warning signs, such as faces expressing fear.</p>
<p>Such neural engineering could have helped prehistoric humans to survive. When our ancestors found themselves surrounded by hungry animals, they would have benefited from an increased ability to learn about hazards. In a safe environment, however, it would have been wasteful to be on high alert constantly. So, a neural switch that automatically increases or decreases our ability to process warnings in response to changes in our environment could have been useful. In fact, people with clinical depression and anxiety seem unable to switch away from a state in which they absorb all the negative messages around them.</p>
<p>It is also important to realise that stress travels rapidly from one person to the next. If a co-worker is stressed, we are more likely to tense up and feel stressed ourselves. We don't even need to be in the same room with someone for their emotions to influence our behaviour. Studies show that if we observe positive feeds on social media, such as images of a pink sunset, we are more likely to post uplifting messages ourselves. If we observe negative posts, such as complaints about a long queue at the coffee shop, we will in turn create more negative posts.</p>
<p>In some ways, many of us now live as if we are in danger, constantly ready to tackle demanding emails and text messages, and respond to news alerts and comments on social media. Repeatedly checking your phone, according to a survey conducted by the American Psychological Association, is related to stress. In other words, a pre-programmed physiological reaction, which evolution has equipped us with to help us avoid famished predators, is now being triggered by an online post. Social media posting, according to one study, raises your pulse, makes you sweat, and enlarges your pupils more than most daily activities.</p>
<p>The fact that stress increases the likelihood that we will focus more on alarming messages, together with the fact that it spreads extremely rapidly, can create collective fear that is not always justified. After a stressful public event, such as a natural disaster or major financial crash, there is often a wave of alarming information in traditional and social media, which individuals become very aware of. But that has the effect of exaggerating existing danger. And so, a reliable pattern emerges – stress is triggered, spreading from one person to the next, which temporarily enhances the likelihood that people will take in negative reports, which increases stress further. As a result, trips are cancelled, even if the disaster took place across the globe; stocks are sold, even when holding on is the best thing to do.</p>
<p>The good news, however, is that positive emotions, such as hope, are contagious too, and are powerful in inducing people to act to find solutions. Being aware of the close relationship between people's emotional state and how they process information can help us frame our messages more effectively and become conscientious agents of change.</p>`,
            groups: [
              {
                instr: "Questions 27–30<br>Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>.",
                type: "mcq",
                items: [
                  { q: 27, text: "In the first paragraph, the writer introduces the topic of the text by", options: ["defining some commonly used terms.", "questioning a widely held assumption.", "mentioning a challenge faced by everyone.", "specifying a situation which makes us most anxious."] },
                  { q: 28, text: "What point does the writer make about firefighters in the second paragraph?", options: ["The regular changes of stress levels in their working lives make them ideal study subjects.", "The strategies they use to handle stress are of particular interest to researchers.", "The stressful nature of their job is typical of many public service professions.", "Their personalities make them especially well-suited to working under stress."] },
                  { q: 29, text: "What is the writer doing in the fourth paragraph?", options: ["explaining their findings", "justifying their approach", "setting out their objectives", "describing their methodology"] },
                  { q: 30, text: "In the seventh paragraph, the writer describes a mechanism in the brain which", options: ["enables people to respond more quickly to stressful situations.", "results in increased ability to control our levels of anxiety.", "produces heightened sensitivity to indications of external threats.", "is activated when there is a need to communicate a sense of danger."] }
                ]
              },
              {
                instr: "Questions 31–35<br>Complete each sentence with the correct ending, <b>A–G</b>, below.",
                type: "match",
                box: [
                  ["A", "made them feel optimistic."],
                  ["B", "took relatively little notice of bad news."],
                  ["C", "responded to negative and positive information in the same way."],
                  ["D", "were feeling under stress."],
                  ["E", "put them in a stressful situation."],
                  ["F", "behaved in a similar manner, regardless of the circumstances."],
                  ["G", "thought it more likely that they would experience something bad."]
                ],
                items: [
                  { q: 31, text: "At times when they were relaxed, the firefighters usually" },
                  { q: 32, text: "The researchers noted that when the firefighters were stressed, they" },
                  { q: 33, text: "When the firefighters were told good news, they always" },
                  { q: 34, text: "The students' cortisol levels and heart rates were affected when the researchers" },
                  { q: 35, text: "In both experiments, negative information was processed better when the subjects" }
                ]
              },
              {
                instr: "Questions 36–40<br>Do the following statements agree with the information given in Reading Passage 3?<br><b>YES</b> if the statement agrees with the claims of the writer<br><b>NO</b> if the statement contradicts the claims of the writer<br><b>NOT GIVEN</b> if it is impossible to say what the writer thinks about this",
                type: "choice",
                choices: ["YES", "NO", "NOT GIVEN"],
                items: [
                  { q: 36, text: "The tone of the content we post on social media tends to reflect the nature of the posts in our feeds." },
                  { q: 37, text: "Phones have a greater impact on our stress levels than other electronic media devices." },
                  { q: 38, text: "The more we read about a stressful public event on social media, the less able we are to take the information in." },
                  { q: 39, text: "Stress created by social media posts can lead us to take unnecessary precautions." },
                  { q: 40, text: "Our tendency to be affected by other people's moods can be used in a positive way." }
                ]
              }
            ]
          }
        ],
        answers: {
          1: "FALSE", 2: "FALSE", 3: "FALSE", 4: "NOT GIVEN", 5: "TRUE", 6: "TRUE",
          7: "bulbs", 8: "soil", 9: "feathers", 10: "deer", 11: "1980", 12: "funding", 13: "stakeholders",
          14: "C", 15: "G", 16: "B", 17: "E", 18: "C",
          19: "B", 20: "A", 21: "B", 22: "C", 23: "A",
          24: "oak", 25: "flooring", 26: "keel",
          27: "C", 28: "A", 29: "D", 30: "C",
          31: "B", 32: "G", 33: "F", 34: "E", 35: "D",
          36: "YES", 37: "NOT GIVEN", 38: "NO", 39: "YES", 40: "YES"
        }
      }
    },
    // ================= TEST 2 =================
    {
      n: 2,
      listening: {
        parts: [
          {
            title: "Help for carers",
            audio: "T2S1.m4a",
            groups: [
              {
                instr: "Questions 1–10<br>Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Help for carers</h4>
<p>Local councils can arrange practical support to help those caring for elderly people at home.</p>
<p>This can give the carer:</p>
<ul>
  <li>time for other responsibilities</li>
  <li>a [[1]]</li>
</ul>
<p><b>Assessment of mother's needs</b></p>
<p>This may include discussion of:</p>
<ul>
  <li>how much [[2]] the caring involves</li>
  <li>what types of tasks are involved, e.g.
    <ul>
      <li>help with dressing</li>
      <li>helping her have a [[3]]</li>
      <li>shopping</li>
      <li>helping with meals</li>
      <li>dealing with [[4]]</li>
    </ul>
  </li>
  <li>any aspects of caring that are especially difficult, e.g.
    <ul>
      <li>loss of [[5]]</li>
      <li>[[6]] her</li>
      <li>preventing a [[7]]</li>
    </ul>
  </li>
</ul>
<p><b>Types of support that may be offered to carers</b></p>
<ul>
  <li>transport costs, e.g. cost of a [[8]]</li>
  <li>car-related costs, e.g. fuel and [[9]]</li>
  <li>help with housework</li>
  <li>help to reduce [[10]]</li>
</ul>`
              }
            ]
          },
          {
            title: "Volunteering in the community",
            audio: "T2S2.m4a",
            groups: [
              {
                instr: "Questions 11–16<br>What is the role of the volunteers in each of the following activities?<br>Choose <b>SIX</b> answers from the box and write the correct letter, <b>A–I</b>, next to Questions 11–16.",
                type: "match",
                boxTitle: "Role of volunteers",
                box: [
                  ["A", "providing entertainment"],
                  ["B", "providing publicity about a council service"],
                  ["C", "contacting local businesses"],
                  ["D", "giving advice to visitors"],
                  ["E", "collecting feedback on events"],
                  ["F", "selling tickets"],
                  ["G", "introducing guest speakers at an event"],
                  ["H", "encouraging cooperation between local organisations"],
                  ["I", "helping people find their seats"]
                ],
                items: [
                  { q: 11, text: "walking around the town centre" },
                  { q: 12, text: "helping at concerts" },
                  { q: 13, text: "getting involved with community groups" },
                  { q: 14, text: "helping with a magazine" },
                  { q: 15, text: "participating at lunches for retired people" },
                  { q: 16, text: "helping with the website" }
                ]
              },
              {
                instr: "Questions 17–20<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                items: [
                  { q: 17, text: "Which event requires the largest number of volunteers?", options: ["the music festival", "the science festival", "the book festival"] },
                  { q: 18, text: "What is the most important requirement for volunteers at the festivals?", options: ["interpersonal skills", "personal interest in the event", "flexibility"] },
                  { q: 19, text: "New volunteers will start working in the week beginning", options: ["2 September.", "9 September.", "23 September."] },
                  { q: 20, text: "What is the next annual event for volunteers?", options: ["a boat trip", "a barbecue", "a party"] }
                ]
              }
            ]
          },
          {
            title: "Human geography",
            audio: "T2S3.m4a",
            groups: [
              {
                instr: "Questions 21–25<br>What is Rosie and Colin's opinion about each of the following aspects of human geography?<br>Choose <b>FIVE</b> answers from the box and write the correct letter, <b>A–G</b>, next to Questions 21–25.",
                type: "match",
                boxTitle: "Opinions",
                box: [
                  ["A", "The information given about this was too vague."],
                  ["B", "This may not be relevant to their course."],
                  ["C", "This will involve only a small number of statistics."],
                  ["D", "It will be easy to find facts about this."],
                  ["E", "The facts about this may not be reliable."],
                  ["F", "No useful research has been done on this."],
                  ["G", "The information provided about this was interesting."]
                ],
                items: [
                  { q: 21, text: "Population" },
                  { q: 22, text: "Health" },
                  { q: 23, text: "Economies" },
                  { q: 24, text: "Culture" },
                  { q: 25, text: "Poverty" }
                ]
              },
              {
                instr: "Questions 26–30<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                items: [
                  { q: 26, text: "Rosie says that in her own city the main problem is", options: ["crime.", "housing.", "unemployment."] },
                  { q: 27, text: "What recent additions to the outskirts of their cities are both students happy about?", options: ["conference centres", "sports centres", "retail centres"] },
                  { q: 28, text: "The students agree that developing disused industrial sites may", options: ["have unexpected costs.", "damage the urban environment.", "destroy valuable historical buildings."] },
                  { q: 29, text: "The students will mention Masdar City as an example of an attempt to achieve", options: ["daily collections for waste recycling.", "sustainable energy use.", "free transport for everyone."] },
                  { q: 30, text: "When discussing the ecotown of Greenhill Abbots, Colin is uncertain about", options: ["what its objectives were.", "why there was opposition to it.", "how much of it has actually been built."] }
                ]
              }
            ]
          },
          {
            title: "Developing food trends",
            audio: "T2S4.m4a",
            groups: [
              {
                instr: "Questions 31–40<br>Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Developing food trends</h4>
<ul>
  <li>The growth in interest in food fashions started with [[31]] of food being shared on social media.</li>
  <li>The UK food industry is constantly developing products which are new or different.</li>
  <li>Influencers on social media become 'ambassadors' for a brand.
    <ul><li>Sales of [[32]] food brands have grown rapidly this way.</li></ul>
  </li>
  <li>Supermarkets track demand for ingredients on social media.
    <ul><li>Famous [[33]] are influential.</li></ul>
  </li>
</ul>
<p><b>Marketing campaigns</b></p>
<ul>
  <li>The avocado:
    <ul>
      <li>[[34]] were invited to visit growers in South Africa.</li>
      <li>Advertising focused on its [[35]] benefits.</li>
    </ul>
  </li>
  <li>Oat milk:
    <ul>
      <li>A Swedish brand's media campaign received publicity by upsetting competitors.</li>
      <li>Promotion in the USA through [[36]] shops reduced the need for advertising.</li>
      <li>It appealed to consumers who are concerned about the [[37]].</li>
    </ul>
  </li>
  <li>Norwegian skrei:
    <ul><li>has helped strengthen the [[38]] of Norwegian seafood.</li></ul>
  </li>
</ul>
<p><b>Ethical concerns</b></p>
<ul>
  <li>Quinoa:
    <ul>
      <li>Its success led to an increase in its [[39]].</li>
      <li>Overuse of resources resulted in poor quality [[40]].</li>
    </ul>
  </li>
</ul>`
              }
            ]
          }
        ],
        answers: {
          1: "break", 2: "time", 3: "shower", 4: "money", 5: "memory", 6: "lifting", 7: "fall", 8: "taxi", 9: "insurance", 10: "stress",
          11: "D", 12: "I", 13: "H", 14: "E", 15: "A", 16: "B",
          17: "B", 18: "A", 19: "B", 20: "A",
          21: "D", 22: "G", 23: "B", 24: "A", 25: "E",
          26: "C", 27: "A", 28: "A", 29: "B", 30: "C",
          31: "photos|photographs|pictures", 32: "vegan", 33: "chefs|cooks", 34: "journalists|reporters", 35: "health", 36: "coffee", 37: "environment", 38: "reputation", 39: "price|cost", 40: "soil"
        }
      },
      reading: {
        passages: [
          {
            title: "Manatees",
            text: `<h3>Manatees</h3>
<p>Manatees, also known as sea cows, are aquatic mammals that belong to a group of animals called Sirenia. This group also contains dugongs. Dugongs and manatees look quite alike — they are similar in size, colour and shape, and both have flexible flippers for forelimbs. However, the manatee has a broad, rounded tail, whereas the dugong's is fluked, like that of a whale. There are three species of manatees: the West Indian manatee (<i>Trichechus manatus</i>), the African manatee (<i>Trichechus senegalensis</i>) and the Amazonian manatee (<i>Trichechus inunguis</i>).</p>
<p>Unlike most mammals, manatees have only six bones in their neck — most others, including humans and giraffes, have seven. This short neck allows a manatee to move its head up and down, but not side to side. To see something on its left or its right, a manatee must turn its entire body, steering with its flippers. Manatees have pectoral flippers but no back limbs, only a tail for propulsion. They do have pelvic bones, however — a leftover from their evolution from a four-legged to a fully aquatic animal. Manatees share some visual similarities to elephants. Like elephants, manatees have thick, wrinkled skin. They also have some hairs covering their bodies which help them sense vibrations in the water around them.</p>
<p>Seagrasses and other marine plants make up most of a manatee's diet. Manatees spend about eight hours each day grazing and uprooting plants. They eat up to 15% of their weight in food each day. African manatees are omnivorous — studies have shown that molluscs and fish make up a small part of their diets. West Indian and Amazonian manatees are both herbivores.</p>
<p>Manatees' teeth are all molars – flat, rounded teeth for grinding food. Due to manatees' abrasive aquatic plant diet, these teeth get worn down and they eventually fall out, so they continually grow new teeth that get pushed forward to replace the ones they lose. Instead of having incisors to grasp their food, manatees have lips which function like a pair of hands to help tear food away from the seafloor.</p>
<p>Manatees are fully aquatic, but as mammals, they need to come up to the surface to breathe. When awake, they typically surface every two to four minutes, but they can hold their breath for much longer. Adult manatees sleep underwater for 10–12 hours a day, but they come up for air every 15–20 minutes. Active manatees need to breathe more frequently. It's thought that manatees use their muscular diaphragm and breathing to adjust their buoyancy. They may use diaphragm contractions to compress and store gas in folds in their large intestine to help them float.</p>
<p>The West Indian manatee reaches about 3.5 metres long and weighs on average around 500 kilogrammes. It moves between fresh water and salt water, taking advantage of coastal mangroves and coral reefs, rivers, lakes and inland lagoons. There are two subspecies of West Indian manatee: the Antillean manatee is found in waters from the Bahamas to Brazil, whereas the Florida manatee is found in US waters, although some individuals have been recorded in the Bahamas. In winter, the Florida manatee is typically restricted to Florida. When the ambient water temperature drops below 20°C, it takes refuge in naturally and artificially warmed water, such as at the warm-water outfalls from powerplants.</p>
<p>The African manatee is also about 3.5 metres long and found in the sea along the west coast of Africa, from Mauritania down to Angola. The species also makes use of rivers, with the mammals seen in landlocked countries such as Mali and Niger. The Amazonian manatee is the smallest species, though it is still a big animal. It grows to about 2.5 metres long and 350 kilogrammes. Amazonian manatees favour calm, shallow waters that are above 23°C. This species is found in fresh water in the Amazon Basin in Brazil, as well as in Colombia, Ecuador and Peru.</p>
<p>All three manatee species are endangered or at a heightened risk of extinction. The African manatee and Amazonian manatee are both listed as Vulnerable by the International Union for Conservation of Nature (IUCN). It is estimated that 140,000 Amazonian manatees were killed between 1935 and 1954 for their meat, fat and skin, with the latter used to make leather. In more recent years, African manatee decline has been tied to incidental capture in fishing nets and hunting. Manatee hunting is now illegal in every country the African species is found in.</p>
<p>The two subspecies of West Indian manatee are listed as Endangered by the IUCN. Both are also expected to undergo a decline of 20% over the next 40 years. A review of almost 1,800 cases of entanglement in fishing nets and of plastic consumption among marine mammals in US waters from 2009 to 2020 found that at least 700 cases involved manatees. The chief cause of death in Florida manatees is boat strikes. However, laws in certain parts of Florida now limit boat speeds during winter, allowing slow-moving manatees more time to respond.</p>`,
            groups: [
              {
                instr: "Questions 1–6<br>Complete the notes below.<br>Choose <b>ONE WORD AND/OR A NUMBER</b> from the passage for each answer.",
                type: "html",
                html: `
<h4 class="center">Manatees</h4>
<p><b>Appearance</b></p>
<ul>
  <li>look similar to dugongs, but with a differently shaped [[1]]</li>
</ul>
<p><b>Movement</b></p>
<ul>
  <li>have fewer neck bones than most mammals</li>
  <li>need to use their [[2]] to help to turn their bodies around in order to look sideways</li>
  <li>sense vibrations in the water by means of [[3]] on their skin</li>
</ul>
<p><b>Feeding</b></p>
<ul>
  <li>eat mainly aquatic vegetation, such as [[4]]</li>
  <li>grasp and pull up plants with their [[5]]</li>
</ul>
<p><b>Breathing</b></p>
<ul>
  <li>come to the surface for air every 2–4 minutes when awake and every 15–20 while sleeping</li>
  <li>may regulate the [[6]] of their bodies by using muscles of diaphragm to store air internally</li>
</ul>`
              },
              {
                instr: "Questions 7–13<br>Do the following statements agree with the information given in Reading Passage 1?<br><b>TRUE</b> if the statement agrees with the information<br><b>FALSE</b> if the statement contradicts the information<br><b>NOT GIVEN</b> if there is no information on this",
                type: "choice",
                choices: ["TRUE", "FALSE", "NOT GIVEN"],
                items: [
                  { q: 7, text: "West Indian manatees can be found in a variety of different aquatic habitats." },
                  { q: 8, text: "The Florida manatee lives in warmer waters than the Antillean manatee." },
                  { q: 9, text: "The African manatee's range is limited to coastal waters between the West African countries of Mauritania and Angola." },
                  { q: 10, text: "The extent of the loss of Amazonian manatees in the mid-twentieth century was only revealed many years later." },
                  { q: 11, text: "It is predicted that West Indian manatee populations will fall in the coming decades." },
                  { q: 12, text: "The risk to manatees from entanglement and plastic consumption increased significantly in the period 2009–2020." },
                  { q: 13, text: "There is some legislation in place which aims to reduce the likelihood of boat strikes on manatees in Florida." }
                ]
              }
            ]
          },
          {
            title: "Procrastination",
            text: `<h3>Procrastination</h3>
<p class="sub"><i>A psychologist explains why we put off important tasks and how we can break this habit</i></p>
<p><b>A</b> Procrastination is the habit of delaying a necessary task, usually by focusing on less urgent, more enjoyable, and easier activities instead. We all do it from time to time. We might be composing a message to a friend who we have to let down, or putting together an important report for college or work; we're doing our best to avoid doing the job at hand, but deep down we know that we should just be getting on with it. Unfortunately, berating ourselves won't stop us procrastinating again. In fact, it's one of the worst things we can do. This matters because, as my research shows, procrastination doesn't just waste time, but is actually linked to other problems, too.</p>
<p><b>B</b> Contrary to popular belief, procrastination is not due to laziness or poor time management. Scientific studies suggest procrastination is, in fact, caused by poor mood management. This makes sense if we consider that people are more likely to put off starting or completing tasks that they are really not keen to do. If just thinking about the task threatens our sense of self-worth or makes us anxious, we will be more likely to put it off. Research involving brain imaging has found that areas of the brain linked to detection of threats and emotion regulation are actually different in people who chronically procrastinate compared to those who don't procrastinate frequently.</p>
<p><b>C</b> Tasks that are emotionally loaded or difficult, such as preparing for exams, are prime candidates for procrastination. People with low self-esteem are more likely to procrastinate. Another group of people who tend to procrastinate are perfectionists, who worry their work will be judged harshly by others. We know that if we don't finish that report or complete those home repairs, then what we did can't be evaluated. When we avoid such tasks, we also avoid the negative emotions associated with them. This is rewarding, and it conditions us to use procrastination to repair our mood. If we engage in more enjoyable tasks instead, we get another mood boost. In the long run, however, procrastination isn't an effective way of managing emotions. The 'mood repair' we experience is temporary. Afterwards, people tend to be left with a sense of guilt that not only increases their negative mood, but also reinforces their tendency to procrastinate.</p>
<p><b>D</b> So why is this such a problem? When most people think of the costs of procrastination, they think of the toll on productivity. For example, studies have shown that procrastination negatively impacts on student performance. But putting off reading textbooks and writing essays may affect other areas of students' lives. In one study of over 3,000 German students over a six-month period, those who reported procrastinating over their university work were also more likely to engage in study-related misconduct, such as cheating and plagiarism. But the behaviour that procrastination was most closely linked with was using fraudulent excuses to get deadline extensions. Other research shows that employees on average spend almost a quarter of their workday procrastinating, and again this is linked with negative outcomes. In fact, in one US survey of over 22,000 employees, participants who said they regularly procrastinated had less annual income and less employment stability. For every one-point increase on a measure of chronic procrastination, annual income decreased by US$15,000.</p>
<p><b>E</b> Procrastination also correlates with serious health and well-being problems. A tendency to procrastinate is linked to poor mental health, including higher levels of depression and anxiety. Across numerous studies, I've found people who regularly procrastinate report a greater number of health issues, such as headaches, flu and colds, and digestive issues. They also experience higher levels of stress and poor sleep quality. They are less likely to practise healthy behaviours, such as eating a healthy diet and regularly exercising, and use destructive coping strategies to manage their stress. In one study of over 700 people, I found people prone to procrastination had a 63% greater risk of poor heart health after accounting for other personality traits and demographics.</p>
<p><b>F</b> Finding better ways of managing our emotions is one route out of the vicious cycle of procrastination. An important first step is to manage our environment and how we view the task. There are a number of evidence-based strategies that can help us fend off distractions that can occupy our minds when we should be focusing on the thing we should be getting on with. For example, reminding ourselves about why the task is important and valuable can increase positive feelings towards it. Forgiving ourselves and feeling compassion when we procrastinate can help break the procrastination cycle. We should admit that we feel bad, but not be overly critical of ourselves. We should remind ourselves that we're not the first person to procrastinate, nor the last. Doing this can take the edge off the negative feelings we have about ourselves when we procrastinate. This can all make it easier to get back on track.</p>`,
            groups: [
              {
                instr: "Questions 14–16<br>Reading Passage 2 has six paragraphs, <b>A–F</b>.<br>Which paragraph contains the following information?<br><i>NB You may use any letter more than once.</i>",
                type: "match",
                letters: "ABCDEF",
                items: [
                  { q: 14, text: "mention of false assumptions about why people procrastinate" },
                  { q: 15, text: "reference to the realisation that others also procrastinate" },
                  { q: 16, text: "neurological evidence of a link between procrastination and emotion" }
                ]
              },
              {
                instr: "Questions 17–22<br>Complete the summary below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<h4 class="center">What makes us procrastinate?</h4>
<p>Many people think that procrastination is the result of [[17]]. Others believe it to be the result of an inability to organise time efficiently.</p>
<p>But scientific studies suggest that procrastination is actually due to poor mood management. The tasks we are most likely to put off are those that could damage our self-esteem or cause us to feel [[18]] when we think about them. Research comparing chronic procrastinators with other people even found differences in the brain regions associated with regulating emotions and identifying [[19]].</p>
<p>Emotionally loaded and difficult tasks often cause us to procrastinate. Getting ready to take [[20]] might be a typical example of one such task.</p>
<p>People who are likely to procrastinate tend to be either [[21]] or those with low self-esteem.</p>
<p>Procrastination is only a short-term measure for managing emotions. It's often followed by a feeling of [[22]], which worsens our mood and leads to more procrastination.</p>`
              },
              {
                instr: "Questions 23 and 24<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [23, 24],
                text: "Which <b>TWO</b> comparisons between employees who often procrastinate and those who do not are mentioned in the text?",
                options: [
                  "Their salaries are lower.",
                  "The quality of their work is inferior.",
                  "They don't keep their jobs for as long.",
                  "They don't enjoy their working lives as much.",
                  "They have poorer relationships with colleagues."
                ]
              },
              {
                instr: "Questions 25 and 26<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [25, 26],
                text: "Which <b>TWO</b> recommendations for getting out of a cycle of procrastination does the writer give?",
                options: [
                  "not judging ourselves harshly",
                  "setting ourselves manageable aims",
                  "rewarding ourselves for tasks achieved",
                  "prioritising tasks according to their importance",
                  "avoiding things that stop us concentrating on our tasks"
                ]
              }
            ]
          },
          {
            title: "Invasion of the Robot Umpires",
            text: `<h3>Invasion of the Robot Umpires</h3>
<p>A few years ago, Fred DeJesus from Brooklyn, New York became the first umpire in a minor league baseball game to use something called the Automated Ball-Strike System (ABS), often referred to as the 'robo-umpire'. Instead of making any judgments himself about a strike*, DeJesus had decisions fed to him through an earpiece, connected to a modified missile-tracking system. The contraption looked like a large black pizza box with one glowing green eye; it was mounted above the press stand.</p>
<p>Major League Baseball (MLB), who had commissioned the system, wanted human umpires to announce the calls, just as they would have done in the past. When the first pitch came in, a recorded voice told DeJesus it was a strike. Previously, calling a strike was a judgment call on the part of the umpire. Even if the batter does not hit the ball, a pitch that passes through the 'strike zone' (an imaginary zone about seventeen inches wide, stretching from the batter's knees to the middle of his chest) is considered a strike. During that first game, when DeJesus announced calls, there was no heckling and no shouted disagreement. Nobody said a word.</p>
<p>For a hundred and fifty years or so, the strike zone has been the game's animating force—countless arguments between a team's manager and the umpire have taken place over its boundaries and whether a ball had crossed through it. The rules of play have evolved in various stages. Today, everyone knows that you may scream your disagreement in an umpire's face, but you must never shout personal abuse at them or touch them. That's a no-no. When the robo-umpires came, however, the arguments stopped.</p>
<p>During the first robo-umpire season, players complained about some strange calls. In response, MLB decided to tweak the dimensions of the zone, and the following year the consensus was that ABS is profoundly consistent. MLB says the device is near-perfect, precise to within fractions of an inch. "It'll reduce controversy in the game, and be good for the game," says Rob Manfred, who is Commissioner for MLB. But the question is whether controversy is worth reducing, or whether it is the sign of a human hand.</p>
<p>A human, at least, yells back. When I spoke with Frank Viola, a coach for a North Carolina team, he said that ABS works as designed, but that it was also unforgiving and pedantic, almost legalistic. "Manfred is a lawyer," Viola noted. Some pitchers have complained that, compared with a human's, the robot's strike zone seems too precise. Viola was once a major-league player himself. When he was pitching, he explained, umpires rewarded skill. "Throw it where you aimed, and it would be a strike, even if it was an inch or two outside. There was a dialogue between pitcher and umpire."</p>
<p>The executive tasked with running the experiment for MLB is Morgan Sword, who's in charge of baseball operations. According to Sword, ABS was part of a larger project to make baseball more exciting since executives are terrified of losing younger fans, as has been the case with horse racing and boxing. He explains how they began the process by asking fans what version of baseball they found most exciting. The results showed that everyone wanted more action: more hits, more defense, more baserunning. This type of baseball essentially hasn't existed since the 1960s, when the hundred-mile-an-hour fastball, which is difficult to hit and control, entered the game. It flattened the game into strikeouts, walks, and home runs—a type of play lacking much action.</p>
<p>Sword's team brainstormed potential fixes. Any rule that existed, they talked about changing—from changing the bats to changing the geometry of the field. But while all of these were ruled out as potential fixes, ABS was seen as a perfect vehicle for change. According to Sword, once you get the technology right, you can load any strike zone you want into the system. "It might be a triangle, or a blob, or something shaped like Texas. Over time, as baseball evolves, ABS can allow the zone to change with it."</p>
<p>"In the past twenty years, sports have moved away from judgment calls. Soccer has Video Assistant Referees (for offside decisions, for example). Tennis has Hawk-Eye (for line calls, for example). For almost a decade, baseball has used instant replay on the base paths. This is widely liked, even if the precision can sometimes cause problems. But these applications deal with something physical: bases, lines, goals. The boundaries of action are precise, delineated like the keys of a piano. This is not the case with ABS and the strike zone. Historically, a certain discretion has been appreciated."</p>
<p>I decided to email Alva Noë, a professor at Berkeley University and a baseball fan, for his opinion. "Hardly a day goes by that I don't wake up and run through the reasons that this [robo-umpires] is such a terrible idea," he replied. He later told me, "This is part of a movement to use algorithms to take the hard choices of living out of life." Perhaps he's right. We watch baseball to kill time, not to maximize it. Some players I have met take a dissenting stance toward the robots too, believing that accuracy is not the answer. According to Joe Russo, who plays for a New Jersey team, "With technology, people just want everything to be perfect. That's not reality. I think perfect would be weird. Your teams are always winning, work is always just great, there's always money in your pocket, your car never breaks down. What is there to talk about?"</p>
<p><i>* strike: a strike is when the batter swings at a ball and misses or when the batter does not swing at a ball that passes through the strike zone.</i></p>`,
            groups: [
              {
                instr: "Questions 27–32<br>Do the following statements agree with the claims of the writer in Reading Passage 3?<br><b>YES</b> if the statement agrees with the claims of the writer<br><b>NO</b> if the statement contradicts the claims of the writer<br><b>NOT GIVEN</b> if it is impossible to say what the writer thinks about this",
                type: "choice",
                choices: ["YES", "NO", "NOT GIVEN"],
                items: [
                  { q: 27, text: "When DeJesus first used ABS, he shared decision-making about strikes with it." },
                  { q: 28, text: "MLB considered it necessary to amend the size of the strike zone when criticisms were received from players." },
                  { q: 29, text: "MLB is keen to justify the money spent on improving the accuracy of ABS's calculations." },
                  { q: 30, text: "The hundred-mile-an-hour fastball led to a more exciting style of play." },
                  { q: 31, text: "The differing proposals for alterations to the baseball bat led to fierce debate on Sword's team." },
                  { q: 32, text: "ABS makes changes to the shape of the strike zone feasible." }
                ]
              },
              {
                instr: "Questions 33–37<br>Complete the summary using the list of phrases, <b>A–H</b>, below.",
                type: "html",
                letters: "ABCDEFGH",
                box: [
                  ["A", "pitch boundary"],
                  ["B", "numerous disputes"],
                  ["C", "team tactics"],
                  ["D", "subjective assessment"],
                  ["E", "widespread approval"],
                  ["F", "former roles"],
                  ["G", "total silence"],
                  ["H", "perceived area"]
                ],
                html: `
<h4 class="center">Calls by the umpire</h4>
<p>Even after ABS was developed, MLB still wanted human umpires to shout out decisions as they had in their [[33]]. The umpire's job had, at one time, required a [[34]] about whether a ball was a strike. A ball is considered a strike when the batter does not hit it and it crosses through a [[35]] extending approximately from the batter's knee to his chest.</p>
<p>In the past, [[36]] over strike calls were not uncommon, but today everyone accepts the complete ban on pushing or shoving the umpire. One difference, however, is that during the first game DeJesus used ABS, strike calls were met with [[37]].</p>`
              },
              {
                instr: "Questions 38–40<br>Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>.",
                type: "mcq",
                items: [
                  { q: 38, text: "What does the writer suggest about ABS in the fifth paragraph?", options: ["It is bound to make key decisions that are wrong.", "It may reduce some of the appeal of the game.", "It will lead to the disappearance of human umpires.", "It may increase calls for the rules of baseball to be changed."] },
                  { q: 39, text: "Morgan Sword says that the introduction of ABS", options: ["was regarded as an experiment without a guaranteed outcome.", "was intended to keep up with developments in other sports.", "was a response to changing attitudes about the role of sport.", "was an attempt to ensure baseball retained a young audience."] },
                  { q: 40, text: "Why does the writer include the views of Noë and Russo?", options: ["to show that attitudes to technology vary widely", "to argue that people have unrealistic expectations of sport", "to indicate that accuracy is not the same thing as enjoyment", "to suggest that the number of baseball fans needs to increase"] }
                ]
              }
            ]
          }
        ],
        answers: {
          1: "tail", 2: "flippers", 3: "hair|hairs", 4: "seagrasses", 5: "lips", 6: "buoyancy",
          7: "TRUE", 8: "NOT GIVEN", 9: "FALSE", 10: "NOT GIVEN", 11: "TRUE", 12: "NOT GIVEN", 13: "TRUE",
          14: "B", 15: "F", 16: "B",
          17: "laziness", 18: "anxious", 19: "threats", 20: "exams", 21: "perfectionists", 22: "guilt",
          23: "A", 24: "C", 25: "A", 26: "E",
          27: "NO", 28: "YES", 29: "NOT GIVEN", 30: "NO", 31: "NOT GIVEN", 32: "YES",
          33: "F", 34: "D", 35: "H", 36: "B", 37: "G",
          38: "B", 39: "D", 40: "C"
        }
      }
    },
    // ================= TEST 3 =================
    {
      n: 3,
      listening: {
        parts: [
          {
            title: "Furniture Rental Companies",
            audio: "T3S1.m4a",
            groups: [
              {
                instr: "Questions 1–10<br>Complete the table below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<table class="grid">
<tr><th colspan="3" style="text-align:center">Furniture Rental Companies</th></tr>
<tr><th>Name of company</th><th>Information about costs</th><th>Additional notes</th></tr>
<tr>
  <td>Peak Rentals</td>
  <td>Prices range from $105 to $ [[1]] per room per month</td>
  <td><ul><li>The furniture is very [[2]]</li><li>Delivers in 1–2 days</li><li>Special offer: free [[3]] with every living room set</li></ul></td>
</tr>
<tr>
  <td>[[4]] and Oliver</td>
  <td><ul><li>Mid-range prices</li><li>12% monthly fee for [[5]]</li></ul></td>
  <td>Also offers a cleaning service</td>
</tr>
<tr>
  <td>Larch Furniture</td>
  <td>Offers cheapest prices for renting furniture and [[6]] items</td>
  <td><ul><li>Must have own [[7]]</li><li>Minimum contract length: six months</li></ul></td>
</tr>
<tr>
  <td>[[8]] Rentals</td>
  <td>See the [[9]] for the most up-to-date prices</td>
  <td>[[10]] are allowed within 7 days of delivery</td>
</tr>
</table>`
              }
            ]
          },
          {
            title: "Bidcaster Archaeological Dig",
            audio: "T3S2.m4a",
            groups: [
              {
                instr: "Questions 11–16<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                items: [
                  { q: 11, text: "Who was responsible for starting the community project?", options: ["the castle owners", "a national charity", "the local council"] },
                  { q: 12, text: "How was the gold coin found?", options: ["Heavy rain had removed some of the soil.", "The ground was dug up by wild rabbits.", "A person with a metal detector searched the area."] },
                  { q: 13, text: "What led the archaeologists to believe there was an ancient village on this site?", options: ["the lucky discovery of old records", "the bases of several structures visible in the grass", "the unusual stones found near the castle"] },
                  { q: 14, text: "What are the team still hoping to find?", options: ["everyday pottery", "animal bones", "pieces of jewellery"] },
                  { q: 15, text: "What was found on the other side of the river to the castle?", options: ["the remains of a large palace", "the outline of fields", "a number of small huts"] },
                  { q: 16, text: "What do the team plan to do after work ends this summer?", options: ["prepare a display for a museum", "take part in a television programme", "start to organise school visits"] }
                ]
              },
              {
                instr: "Questions 17–20<br>Label the map below.<br>Choose the correct letter, <b>A–G</b>, next to Questions 17–20.",
                type: "match",
                image: "assets/b20/t3-p72.png",
                letters: "ABCDEFG",
                items: [
                  { q: 17, text: "bridge foundations" },
                  { q: 18, text: "rubbish pit" },
                  { q: 19, text: "meeting hall" },
                  { q: 20, text: "fish pond" }
                ]
              }
            ]
          },
          {
            title: "Theatre programmes",
            audio: "T3S3.m4a",
            groups: [
              {
                instr: "Questions 21–26<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                items: [
                  { q: 21, text: "Finn was pleased to discover that their topic", options: ["was not familiar to their module leader.", "had not been chosen by other students.", "did not prove to be difficult to research."] },
                  { q: 22, text: "Maya says a mistaken belief about theatre programmes is that", options: ["theatres pay companies to produce them.", "few theatre-goers buy them nowadays.", "they contain far more adverts than previously."] },
                  { q: 23, text: "Finn was surprised that, in early British theatre, programmes", options: ["were difficult for audiences to obtain.", "were given out free of charge.", "were seen as a kind of contract."] },
                  { q: 24, text: "Maya feels their project should include an explanation of why companies of actors", options: ["promoted their own plays.", "performed plays outdoors.", "had to tour with their plays."] },
                  { q: 25, text: "Finn and Maya both think that, compared to nineteenth-century programmes, those from the eighteenth century", options: ["were more original.", "were more colourful.", "were more informative."] },
                  { q: 26, text: "Maya doesn't fully understand why, in the twentieth century,", options: ["very few theatre programmes were printed in the USA.", "British theatre programmes failed to develop for so long.", "theatre programmes in Britain copied fashions from the USA."] }
                ]
              },
              {
                instr: "Questions 27–30<br>What comment is made about the programme for each of the following shows?<br>Choose <b>FOUR</b> answers from the box and write the correct letter, <b>A–F</b>, next to Questions 27–30.",
                type: "match",
                boxTitle: "Comments about programme",
                box: [
                  ["A", "Its origin is somewhat controversial."],
                  ["B", "It is historically significant for a country."],
                  ["C", "It was effective at attracting audiences."],
                  ["D", "It is included in a recent project."],
                  ["E", "It contains insights into the show."],
                  ["F", "It resembles an artwork."]
                ],
                items: [
                  { q: 27, text: "Ruy Blas" },
                  { q: 28, text: "Man of La Mancha" },
                  { q: 29, text: "The Tragedy of Jane Shore" },
                  { q: 30, text: "The Sailors' Festival" }
                ]
              }
            ]
          },
          {
            title: "Inclusive design",
            audio: "T3S4.m4a",
            groups: [
              {
                instr: "Questions 31–40<br>Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Inclusive design</h4>
<p><b>Definition</b></p>
<ul>
  <li>Designing products that can be accessed by a diverse range of people without the need for any [[31]]</li>
  <li>Not the same as universal design: that is design for everyone, including catering for people with [[32]] problems.</li>
</ul>
<p><b>Examples of inclusive design</b></p>
<ul>
  <li>[[33]] which are adjustable, avoiding back or neck problems</li>
  <li>[[34]] in public toilets which are easier to use</li>
  <li>To assist the elderly:
    <ul>
      <li>designers avoid using [[35]] in interfaces</li>
      <li>people can make commands using a mouse, keyboard or their [[36]]</li>
    </ul>
  </li>
</ul>
<p><b>Impact of non-inclusive designs</b></p>
<ul>
  <li>Access
    <ul><li>Loss of independence for disabled people.</li></ul>
  </li>
  <li>Safety
    <ul>
      <li>Seatbelts are especially problematic for [[37]] women.</li>
      <li>PPE jackets are often unsuitable because of the size of women's [[38]]</li>
      <li>PPE for female [[39]] officers dealing with emergencies is the worst.</li>
    </ul>
  </li>
  <li>Comfort in the workplace
    <ul><li>The [[40]] in offices is often too low for women.</li></ul>
  </li>
</ul>`
              }
            ]
          }
        ],
        answers: {
          1: "239|two hundred thirty-nine|two hundred and thirty-nine", 2: "modern", 3: "lamp", 4: "Aaron", 5: "damage", 6: "electronic", 7: "insurance", 8: "space|Space", 9: "app", 10: "exchanges",
          11: "B", 12: "A", 13: "A", 14: "C", 15: "B", 16: "C",
          17: "B", 18: "A", 19: "G", 20: "E",
          21: "B", 22: "A", 23: "C", 24: "A", 25: "C", 26: "B",
          27: "F", 28: "E", 29: "B", 30: "D",
          31: "adaptation", 32: "cognitive", 33: "desks", 34: "taps", 35: "blue", 36: "voice", 37: "pregnant", 38: "shoulders", 39: "police", 40: "temperature"
        }
      },
      reading: {
        passages: [
          {
            title: "Frozen Food",
            text: `<h3>Frozen Food</h3>
<p class="sub"><i>A US perspective on the development of the frozen food industry</i></p>
<p>At some point in history, humans discovered that ice preserved food. There is evidence that winter ice was stored to preserve food in the summer as far back as 10,000 years ago. Two thousand years ago, the inhabitants of South America's Andean mountains had a unique means of conserving potatoes for later consumption. They froze them overnight, then trampled them to squeeze out the moisture, then dried them in the sun. This preserved their nutritional value—if not their aesthetic appeal.</p>
<p>Natural ice remained the main form of refrigeration until late in the 19th century. In the early 1800s, ship owners from Boston, USA, had enormous blocks of Arctic ice towed all over the Atlantic for the purpose of food preservation. In 1851, railroads first began putting blocks of ice in insulated rail cars to send butter from Ogdensburg, New York, to Boston.</p>
<p>Finally, in 1870, Australian inventors found a way to make 'mechanical ice'. They used a compressor to force a gas—ammonia at first and later Freon—through a condenser. The compressed gas gave up some of its heat as it moved through the condenser. Then the gas was released quickly into a low-pressure evaporator coil where it became liquid and cold. Air was blown over the evaporator coil and then this cooled air passed into an insulated compartment, lowering its temperature to freezing point.</p>
<p>Initially, this process was invented to keep Australian beer cool even in hot weather. But Australian cattlemen were quick to realize that, if they could put this new invention on a ship, they could export meat across the oceans. In 1880, a shipment of Australian beef and mutton was sent, frozen, to England. While the food frozen this way was still palatable, there was some deterioration. During the freezing process, crystals formed within the cells of the food, and when the ice expanded and the cells burst, this spoilt the flavor and texture of the food.</p>
<p>The modern frozen food industry began with the indigenous Inuit people of Canada. In 1912, a biology student in Massachusetts, USA, named Clarence Birdseye, ran out of money and went to Labrador in Canada to trap and trade furs. While he was there, he became fascinated with how the Inuit would quickly freeze fish in the Arctic air. The fish looked and tasted fresh even months later.</p>
<p>Birdseye returned to the USA in 1917 and began developing mechanical freezers capable of quick-freezing food. Birdseye methodically kept inventing better freezers and gradually built a business selling frozen fish from Gloucester, Massachusetts. In 1929, his business was sold and became General Foods, but he stayed with the company as director of research, and his division continued to innovate.</p>
<p>Birdseye was responsible for several key innovations that made the frozen food industry possible. He developed quick-freezing techniques that reduced the damage that crystals caused, as well as the technique of freezing the product in the package it was to be sold in. He also introduced the use of cellophane, the first transparent material for food packaging, which allowed consumers to see the quality of the product. Birdseye products also came in convenient size packages that could be prepared with a minimum of effort.</p>
<p>But there were still obstacles. In the 1930s, few grocery stores could afford to buy freezers for a market that wasn't established yet. So, Birdseye leased inexpensive freezer cases to them. He also leased insulated railroad cars so that he could ship his products nationwide. However, few consumers had freezers large enough or efficient enough to take advantage of the products.</p>
<p>Sales increased in the early 1940s, when World War II gave a boost to the frozen food industry because tin was being used for munitions. Canned foods were rationed to save tin for the war effort, while frozen foods were abundant and cheap. Finally, by the 1950s, refrigerator technology had developed far enough to make these appliances affordable for the average family. By 1953, 33 million US families owned a refrigerator, and manufacturers were gradually increasing the size of the freezer compartments in them.</p>
<p>1950s families were also looking for convenience at mealtimes, so the moment was right for the arrival of the 'TV Dinner'. Swanson Foods was a large, nationally recognized producer of canned and frozen poultry. In 1954, the company adapted some of Birdseye's freezing techniques, and with the help of a clever name and a huge advertising budget, it launched the first 'TV Dinner'. This consisted of frozen turkey, potatoes and vegetables served in the same segmented aluminum tray that was used by airlines. The product was an instant success. Within a year, Swanson had sold 13 million TV dinners. American consumers couldn't resist the combination of a trusted brand name, a single-serving package and the convenience of a meal that could be ready after only 25 minutes in a hot oven. By 1959, Americans were spending $2.7 billion annually on frozen foods, and half a billion of that was spent on ready-prepared meals such as the TV Dinner.</p>
<p>Today, the US frozen food industry has a turnover of over $67 billion annually, with $26.6 billion of that sold to consumers for home consumption. The remaining $40 billion in frozen food sales come through restaurants, cafeterias, hospitals and schools, and that represents a third of the total food service sales.</p>`,
            groups: [
              {
                instr: "Questions 1–7<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<h4 class="center">The history of frozen food</h4>
<p><b>2,000 years ago, South America</b></p>
<ul><li>People conserved the nutritional value of [[1]], using a method of freezing then drying.</li></ul>
<p><b>1851, USA</b></p>
<ul><li>[[2]] was kept cool by ice during transportation in specially adapted trains.</li></ul>
<p><b>1880, Australia</b></p>
<ul><li>Two kinds of [[3]] were the first frozen food shipped to England.</li></ul>
<p><b>1917 onwards, USA</b></p>
<ul>
  <li>Clarence Birdseye introduced innovations including:
    <ul>
      <li>quick-freezing methods, so that [[4]] did not spoil the food.</li>
      <li>packaging products with [[5]], so the product was visible.</li>
    </ul>
  </li>
</ul>
<p><b>Early 1940s, USA</b></p>
<ul><li>Frozen food became popular because of a shortage of [[6]].</li></ul>
<p><b>1950s, USA</b></p>
<ul><li>A large number of homes now had a [[7]].</li></ul>`
              },
              {
                instr: "Questions 8–13<br>Do the following statements agree with the information given in Reading Passage 1?<br><b>TRUE</b> if the statement agrees with the information<br><b>FALSE</b> if the statement contradicts the information<br><b>NOT GIVEN</b> if there is no information on this",
                type: "choice",
                choices: ["TRUE", "FALSE", "NOT GIVEN"],
                items: [
                  { q: 8, text: "The ice transportation business made some Boston ship owners very wealthy in the early 1800s." },
                  { q: 9, text: "A disadvantage of the freezing process invented in Australia was that it affected the taste of food." },
                  { q: 10, text: "Clarence Birdseye travelled to Labrador in order to learn how the Inuit people froze fish." },
                  { q: 11, text: "Swanson Foods invested a great deal of money in the promotion of the TV Dinner." },
                  { q: 12, text: "Swanson Foods developed a new style of container for the launch of the TV Dinner." },
                  { q: 13, text: "The US frozen food industry is currently the largest in the world." }
                ]
              }
            ]
          },
          {
            title: "Can the planet's coral reefs be saved?",
            text: `<h3>Can the planet's coral reefs be saved?</h3>
<p><b>A</b> Conservationists have put the final touches to a giant artificial reef they have been assembling at the world-renowned Zoological Society of London (London Zoo). Samples of the planet's most spectacular corals — vivid green branching coral, yellow scroll, blue ridge and many more species — have been added to the giant tank along with fish that thrive in their presence: blue tang, clownfish and many others. The reef is in the zoo's new gallery, Tiny Giants, which is dedicated to the minuscule invertebrate creatures that sustain life across the planet. The coral reef tank and its seven-metre-wide window form the core of the exhibition.</p>
<p>'Coral reefs are the most diverse ecosystems on Earth and we want to show people how wonderful they are,' said Paul Pearce-Kelly, senior curator of invertebrates and fish at the Zoological Society of London. 'However, we also want to highlight the research and conservation efforts that are now being carried out to try to save them from the threat of global warming.' They want people to see what is being done to try to save these wonders.</p>
<p><b>B</b> Corals are composed of tiny animals, known as polyps, with tentacles for capturing small marine creatures in the sea water. These polyps are transparent but get their brilliant tones of pink, orange, blue, green, etc. from algae that live within them, which in turn get protection, while their photosynthesising of the sun's rays provides nutrients for the polyps. This comfortable symbiotic relationship has led to the growth of coral reefs that cover 0.1% of the planet's ocean bed while providing homes for more than 25% of marine species, including fish, molluscs, sponges and shellfish.</p>
<p><b>C</b> As a result, coral reefs are often described as the 'rainforests of the sea', though the comparison is dismissed by some naturalists, including David Attenborough. 'People say you cannot beat the rainforest,' Attenborough has stated. 'But that is simply not true. You go there and the first thing you think is: where ... are the birds? Where are the animals? They are hiding in the trees, of course. No, if you want beauty and wildlife, you want a coral reef. Put on a mask and stick your head under the water. The sight is mind-blowing.'</p>
<p><b>D</b> Unfortunately, these majestic sights are now under very serious threat, with the most immediate problem coming in the form of thermal stress. Rising ocean temperatures are triggering bleaching events that strip reefs of their colour and eventually kill them. And that is just the start. Other menaces include ocean acidification, sea level increase, pollution by humans, deoxygenation and ocean current changes, while the climate crisis is also increasing habitat destruction. As a result, vast areas — including massive chunks of Australia's Great Barrier Reef — have already been destroyed, and scientists advise that more than 90% of reefs could be lost by 2050 unless urgent action is taken to tackle global heating and greenhouse gas emissions.</p>
<p>Pearce-Kelly says that coral reefs have to survive really harsh conditions — wave erosion and other factors. And 'when things start to go wrong in the oceans, then corals will be the first to react. And that is exactly what we are seeing now. Coral reefs are dying and they are telling us that all is not well with our planet.'</p>
<p><b>E</b> However, scientists are trying to pinpoint hardy types of coral that could survive our overheated oceans, and some of this research will be carried out at London Zoo. 'Behind our ... coral reef tank we have built laboratories where scientists will be studying coral species,' said Pearce-Kelly. One aim will be to carry out research on species to find those that can survive best in warm, acidic waters. Another will be to try to increase coral breeding rates. 'Coral spawn just once a year,' he added. 'However, aquarium-based research has enabled some corals to spawn artificially, which can assist coral reef restoration efforts. And if this can be extended for all species, we could consider the launching of coral-spawning programmes several times a year. That would be a big help in restoring blighted reefs.'</p>
<p><b>F</b> Research in these fields is being conducted in laboratories around the world, with the London Zoo centre linked to this global network. Studies carried out in one centre can then be tested in others. The resulting young coral can then be displayed in the tank in Tiny Giants. 'The crucial point is that the progress we make in making coral better able to survive in a warming world can be shown to the public and encourage them to believe that we can do something to save the planet's reefs,' said Pearce-Kelly. 'Saving our coral reefs is now a critically important ecological goal.'</p>`,
            groups: [
              {
                instr: "Questions 14–19<br>Reading Passage 2 has six sections, <b>A–F</b>.<br>Choose the correct heading for each section from the list of headings below.",
                type: "match",
                boxTitle: "List of Headings",
                box: [
                  ["i", "Tried and tested solutions"],
                  ["ii", "Cooperation beneath the waves"],
                  ["iii", "Working to lessen the problems"],
                  ["iv", "Disagreement about the accuracy of a certain phrase"],
                  ["v", "Two clear educational goals"],
                  ["vi", "Promoting hope"],
                  ["vii", "A warning of further trouble ahead"]
                ],
                items: [
                  { q: 14, text: "Section A" },
                  { q: 15, text: "Section B" },
                  { q: 16, text: "Section C" },
                  { q: 17, text: "Section D" },
                  { q: 18, text: "Section E" },
                  { q: 19, text: "Section F" }
                ]
              },
              {
                instr: "Questions 20 and 21<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [20, 21],
                text: "Which <b>TWO</b> of these causes of damage to coral reefs are mentioned by the writer of the text?",
                options: [
                  "a rising number of extreme storms",
                  "the removal of too many fish from the sea",
                  "the contamination of the sea from waste",
                  "increased disease among marine species",
                  "alterations in the usual flow of water in the seas"
                ]
              },
              {
                instr: "Questions 22 and 23<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [22, 23],
                text: "Which <b>TWO</b> of the following statements are true of the researchers at London Zoo?",
                options: [
                  "They are hoping to expand the numbers of different corals being bred in laboratories.",
                  "They want to identify corals that can cope well with the changed sea conditions.",
                  "They are looking at ways of creating artificial reefs that corals could grow on.",
                  "They are trying out methods that would speed up reproduction in some corals.",
                  "They are investigating materials that might protect reefs from higher temperatures."
                ]
              },
              {
                instr: "Questions 24–26<br>Complete the sentences below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<p><b>24</b> Corals have a number of [[24]] which they use to collect their food.</p>
<p><b>25</b> Algae gain [[25]] from being inside the coral.</p>
<p><b>26</b> Increases in the warmth of the sea water can remove the [[26]] from coral.</p>`
              }
            ]
          },
          {
            title: "Robots and us",
            text: `<h3>Robots and us</h3>
<p class="sub"><i>Three leaders in their fields answer questions about our relationships with robots</i></p>
<p>When asked 'Should robots be used to colonise other planets?', cosmology and astrophysics Professor Martin Rees said he believed the solar system would be mapped by robotic craft by the end of the century. 'The next step would be mining of asteroids, enabling fabrication of large structures in space without having to bring all the raw materials from Earth. ... I think this is more realistic and benign than the ... "terraforming"* of planets.' He maintains that colonised planets 'should be preserved with a status that is analogous to Antarctica here on Earth.'</p>
<p>On the question of using robots to colonise other planets and exploit mineral resources, engineering Professor Daniel Wolpert replied, 'I don't see a pressing need to colonise other planets unless we can bring [these] resources back to Earth. The vast majority of Earth is currently inaccessible to us. Using robots to gather resources nearer to home would seem to be a better use of our robotic tools.'</p>
<p>Meanwhile, for anthropology Professor Kathleen Richardson, the idea of 'colonisation' of other planets seemed morally dubious: 'I think whether we do something on Earth or on Mars we should always do it in the spirit of a genuine interest in "the Other", not to impose a particular model, but to meet "the Other".'</p>
<p>In response to the second question, 'How soon will machine intelligence outstrip human intelligence?' Rees mentions robots that are advanced enough to beat humans at chess, but then goes on to say, 'Robots are still limited in their ability to sense their environment: they can't yet recognise and move the pieces on a real chessboard as cleverly as a child can. Later this century, however, their more advanced successors may relate to their surroundings, and to people, as adeptly as we do. Moral questions then arise. ... Should we feel guilty about exploiting [sophisticated robots]? Should we fret if they are underemployed, frustrated, or bored?'</p>
<p>Wolpert's response to the question about machine intelligence outstripping human intelligence was this: 'In a limited sense it already has. Machines can already navigate, remember and search for items with an ability that far outstrips humans. However, there is no machine that can identify visual objects or speech with the reliability and flexibility of humans. ... Expecting a machine close to the creative intelligence of a human within the next 50 years would be highly ambitious.'</p>
<p>Richardson believes that our fear of machines becoming too advanced has more to do with human nature than anything intrinsic to the machines themselves. In her view, it stems from humans' tendency to personify inanimate objects: we create machines based on representations of ourselves, imagine that machines think and behave as we do, and therefore see them as an autonomous threat. 'One of the consequences of thinking that the problem lies with machines is that ... we tend to imagine they are greater and more powerful than they really are and subsequently they become so.'</p>
<p>This led on to the third question, 'Should we be scared by advances in artificial intelligence?' To this question, Rees replied, 'Those who should be worried are the futurologists who believe in the so-called "singularity"**. ... And another worry is that we are increasingly dependent on computer networks, and that these could behave like a single "brain" with a mind of its own, and with goals that may be contrary to human welfare. I think we should ensure that robots remain as no more than "idiot savants" lacking the capacity to outwit us, even though they may greatly surpass us in the ability to calculate and process information.'</p>
<p>Wolpert's response was to say that we have already seen the damaging effects of artificial intelligence in the form of computer viruses. 'But in this case,' he says, 'the real intelligence is the malicious designer. Critically, the benefits of computers outweigh the damage that computer viruses cause. Similarly, while there may be misuses of robotics in the near future, the benefits that they will bring are likely to outweigh these negative aspects.'</p>
<p>Richardson's response to this question was this: 'We need to ask why fears of artificial intelligence and robots persist; none have in fact risen up and challenged human supremacy.' She believes that as robots have never shown themselves to be a threat to humans, it seems unlikely that they ever will. In fact, she went on, 'Not all fear [robots]; many people welcome machine intelligence.'</p>
<p>In answer to the fourth question, 'What can science fiction tell us about robotics?', Rees replied, 'I sometimes advise students that it's better to read first-rate science fiction than second-rate science — more stimulating, and perhaps no more likely to be wrong.'</p>
<p>As his response, Wolpert commented, 'Science fiction has often been remarkable at predicting the future. ... Science fiction has painted a vivid spectrum of possible futures, from cute and helpful robots to dystopian robotic societies. Interestingly, almost no science fiction envisages a future without robots.'</p>
<p>Finally, on the question of science fiction, Richardson pointed out that in modern society, people tend to think there is reality on the one hand, and fiction and fantasy on the other. She then explained that the division did not always exist, and that scientists and technologists made this separation because they wanted to carve out the sphere of their work. 'But the divide is not so clear cut, and that is why the worlds seem to collide at times,' she said. 'In some cases, we need to bring these different understandings together to get a whole perspective. Perhaps then, we won't be so frightened that something we create as a copy of ourselves will be a [threat] to us.'</p>
<p><i>* terraforming: modifying a planet's atmosphere to suit human needs<br>** singularity: the point when robots will be able to start creating ever more sophisticated versions of themselves</i></p>`,
            groups: [
              {
                instr: "Questions 27–33<br>Look at the following statements (Questions 27–33) and the list of experts below.<br>Match each statement with the correct expert, <b>A</b>, <b>B</b> or <b>C</b>.<br><i>NB You may use any letter more than once.</i>",
                type: "match",
                boxTitle: "List of Experts",
                box: [
                  ["A", "Martin Rees"],
                  ["B", "Daniel Wolpert"],
                  ["C", "Kathleen Richardson"]
                ],
                items: [
                  { q: 27, text: "For our own safety, humans will need to restrict the abilities of robots." },
                  { q: 28, text: "The risk of robots harming us is less serious than humans believe it to be." },
                  { q: 29, text: "It will take many decades for robot intelligence to be as imaginative as human intelligence." },
                  { q: 30, text: "We may have to start considering whether we are treating robots fairly." },
                  { q: 31, text: "Robots are probably of more help to us on Earth than in space." },
                  { q: 32, text: "The ideas in high-quality science fiction may prove to be just as accurate as those found in the work of scientists." },
                  { q: 33, text: "There are those who look forward to robots developing greater intelligence." }
                ]
              },
              {
                instr: "Questions 34–36<br>Complete each sentence with the correct ending, <b>A–D</b>, below.",
                type: "match",
                box: [
                  ["A", "robots to explore outer space."],
                  ["B", "advances made in machine intelligence so far."],
                  ["C", "changes made to other planets for our own benefit."],
                  ["D", "the harm already done by artificial intelligence."]
                ],
                items: [
                  { q: 34, text: "Richardson and Rees express similar views regarding the ethical aspect of" },
                  { q: 35, text: "Rees and Wolpert share an opinion about the extent of" },
                  { q: 36, text: "Wolpert disagrees with Richardson on the question of" }
                ]
              },
              {
                instr: "Questions 37–40<br>Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>.",
                type: "mcq",
                items: [
                  { q: 37, text: "What point does Richardson make about fear of machines?", options: ["It has grown alongside the development of ever more advanced robots.", "It is the result of our inclination to attribute human characteristics to non-human entities.", "It has its origins in basic misunderstandings about how inanimate objects function.", "It demonstrates a key difference between human intelligence and machine intelligence."] },
                  { q: 38, text: "What potential advance does Rees see as a cause for concern?", options: ["robots outnumbering people", "robots having abilities which humans do not", "artificial intelligence developing independent thought", "artificial intelligence taking over every aspect of our lives"] },
                  { q: 39, text: "What does Wolpert emphasise in his response to the question about science fiction?", options: ["how science fiction influences our attitudes to robots", "how fundamental robots are to the science fiction genre", "how the image of robots in science fiction has changed over time", "how reactions to similar portrayals of robots in science fiction may vary"] },
                  { q: 40, text: "What is Richardson doing in her comment about reality and fantasy?", options: ["warning people not to confuse one with the other", "outlining ways in which one has impacted on the other", "recommending a change of approach in how people view them", "explaining why scientists have a different perspective on them from other people"] }
                ]
              }
            ]
          }
        ],
        answers: {
          1: "potatoes", 2: "butter", 3: "meat", 4: "crystals", 5: "cellophane", 6: "tin", 7: "refrigerator",
          8: "NOT GIVEN", 9: "TRUE", 10: "FALSE", 11: "TRUE", 12: "FALSE", 13: "NOT GIVEN",
          14: "v", 15: "ii", 16: "iv", 17: "vii", 18: "iii", 19: "vi",
          20: "C", 21: "E", 22: "B", 23: "D",
          24: "tentacles", 25: "protection", 26: "colour",
          27: "A", 28: "C", 29: "B", 30: "A", 31: "B", 32: "A", 33: "C",
          34: "C", 35: "B", 36: "D", 37: "B", 38: "C", 39: "B", 40: "C"
        }
      }
    },
    // ================= TEST 4 =================
    {
      n: 4,
      listening: {
        parts: [
          {
            title: "Advice on family visit",
            audio: "T4S1.m4a",
            groups: [
              {
                instr: "Questions 1–10<br>Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Advice on family visit</h4>
<p><b>Accommodation</b></p>
<ul>
  <li>[[1]] Hotel on George Street</li>
  <li>cost of family room per night: £ [[2]] (approx.)</li>
</ul>
<p><b>Recommended trips</b></p>
<ul>
  <li>a [[3]] tour of the city centre (starts in Carlton Square)</li>
  <li>a trip by [[4]] to the old fort</li>
</ul>
<p><b>Science Museum</b></p>
<ul>
  <li>best day to visit: [[5]]</li>
  <li>see the exhibition about [[6]], which opens soon</li>
</ul>
<p><b>Food</b></p>
<ul>
  <li>Clacton Market:
    <ul>
      <li>good for [[7]] food</li>
      <li>need to have lunch before [[8]] p.m.</li>
    </ul>
  </li>
</ul>
<p><b>Theatre tickets</b></p>
<ul>
  <li>save up to [[9]] % on ticket prices at bargaintickets.com</li>
</ul>
<p><b>Free activities</b></p>
<ul>
  <li>Blakewell Gardens:
    <ul>
      <li>Roots Music Festival</li>
      <li>climb Telegraph Hill to see a view of the [[10]]</li>
    </ul>
  </li>
</ul>`
              }
            ]
          },
          {
            title: "Visiting the football stadium",
            audio: "T4S2.m4a",
            groups: [
              {
                instr: "Questions 11 and 12<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [11, 12],
                text: "Which <b>TWO</b> things does the speaker say about visiting the football stadium with children?",
                options: [
                  "Children can get their photo taken with a football player.",
                  "There is a competition for children today.",
                  "Parents must stay with their children at all times.",
                  "Children will need sunhats and drinks.",
                  "The café has a special offer on meals for children."
                ]
              },
              {
                instr: "Questions 13 and 14<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [13, 14],
                text: "Which <b>TWO</b> features of the stadium tour are new this year?",
                options: [
                  "VIP tour",
                  "360 cinema experience",
                  "audio guide",
                  "dressing room tour",
                  "tours in other languages"
                ]
              },
              {
                instr: "Questions 15–20<br>Which event in the history of football in the UK took place in each of the following years?<br>Choose <b>SIX</b> answers from the box and write the correct letter, <b>A–H</b>, next to Questions 15–20.",
                type: "match",
                boxTitle: "Events in the history of football",
                box: [
                  ["A", "the introduction of pay for the players"],
                  ["B", "a change to the design of the goal"],
                  ["C", "the first use of lights for matches"],
                  ["D", "the introduction of goalkeepers"],
                  ["E", "the first international match"],
                  ["F", "two changes to the rules of the game"],
                  ["G", "the introduction of a fee for spectators"],
                  ["H", "an agreement on the length of a game"]
                ],
                items: [
                  { q: 15, text: "1870" },
                  { q: 16, text: "1874" },
                  { q: 17, text: "1875" },
                  { q: 18, text: "1877" },
                  { q: 19, text: "1878" },
                  { q: 20, text: "1880" }
                ]
              }
            ]
          },
          {
            title: "Teaching handwriting",
            audio: "T4S3.m4a",
            groups: [
              {
                instr: "Questions 21 and 22<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [21, 22],
                text: "Which <b>TWO</b> benefits for children of learning to write did both students find surprising?",
                options: [
                  "improved fine motor skills",
                  "improved memory",
                  "improved concentration",
                  "improved imagination",
                  "improved spatial awareness"
                ]
              },
              {
                instr: "Questions 23 and 24<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi",
                qs: [23, 24],
                text: "For children with dyspraxia, which <b>TWO</b> problems with handwriting do the students think are easiest to correct?",
                options: [
                  "not spacing letters correctly",
                  "not writing in a straight line",
                  "applying too much pressure when writing",
                  "confusing letter shapes",
                  "writing very slowly"
                ]
              },
              {
                instr: "Questions 25–30<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "Teaching handwriting",
                items: [
                  { q: 25, text: "What does the woman say about using laptops to teach writing to children with dyslexia?", options: ["Children often lack motivation to learn that way.", "Children become fluent relatively quickly.", "Children react more positively if they make a mistake."] },
                  { q: 26, text: "When discussing whether to teach cursive or print writing, the woman thinks that", options: ["cursive writing disadvantages a certain group of children.", "print writing is associated with lower academic performance.", "most teachers in the UK prefer a traditional approach to handwriting."] },
                  { q: 27, text: "According to the students, what impact does poor handwriting have on exam performance?", options: ["There is evidence to suggest grades are affected by poor handwriting.", "Neat handwriting is less important now than it used to be.", "Candidates write more slowly and produce shorter answers."] },
                  { q: 28, text: "What prediction does the man make about the future of handwriting?", options: ["Touch typing will be taught before writing by hand.", "Children will continue to learn to write by hand.", "People will dislike handwriting on digital devices."] },
                  { q: 29, text: "The woman is concerned that relying on digital devices has made it difficult for her to", options: ["take detailed notes.", "spell and punctuate.", "read old documents."] },
                  { q: 30, text: "How do the students feel about their own handwriting?", options: ["concerned they are unable to write quickly", "embarrassed by comments made about it", "regretful that they have lost the habit"] }
                ]
              }
            ]
          },
          {
            title: "Research in the area around the Chembe Bird Sanctuary",
            audio: "T4S4.m4a",
            groups: [
              {
                instr: "Questions 31–40<br>Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Research in the area around the Chembe Bird Sanctuary</h4>
<p><b>The importance of birds of prey to the local communities</b></p>
<ul>
  <li>They destroy [[31]] and other rodents.</li>
  <li>They help to prevent farmers from being bitten by [[32]].</li>
  <li>They have been an important part of the local culture for many years.</li>
  <li>They now support the economy by encouraging [[33]] in the area.</li>
</ul>
<p><b>Falling numbers of birds of prey</b></p>
<ul>
  <li>The birds may be accidentally killed
    <ul>
      <li>by [[34]] when they are hunting or sleeping</li>
      <li>by electrocution from contact with power lines, especially at times when there is a lot of [[35]].</li>
    </ul>
  </li>
  <li>Local farmers may illegally shoot them or [[36]] them.</li>
</ul>
<p><b>Ways of protecting chickens from birds of prey</b></p>
<ul>
  <li>clearing away vegetation from the area (unhelpful)</li>
  <li>providing a [[37]] for chickens (expensive)</li>
  <li>frightening birds of prey by
    <ul>
      <li>keeping a [[38]]</li>
      <li>making a [[39]] – e.g. with metal objects</li>
    </ul>
  </li>
  <li>A [[40]] of methods is usually most effective.</li>
</ul>`
              }
            ]
          }
        ],
        answers: {
          1: "Kings|King's", 2: "125|one hundred and twenty-five|one hundred twenty-five", 3: "walking", 4: "boat", 5: "Tuesday", 6: "space", 7: "vegetarian", 8: "2.30|two thirty", 9: "75|seventy-five", 10: "port",
          11: "B", 12: "C", 13: "A", 14: "C",
          15: "D", 16: "F", 17: "B", 18: "H", 19: "C", 20: "G",
          21: "C", 22: "E", 23: "A", 24: "C", 25: "C", 26: "A", 27: "A", 28: "B", 29: "B", 30: "C",
          31: "rats", 32: "snakes", 33: "tourism", 34: "traffic", 35: "rain", 36: "poison", 37: "building", 38: "dog", 39: "noise", 40: "combination"
        }
      },
      reading: {
        passages: [
          {
            title: "Georgia O'Keeffe",
            text: `<h3>Georgia O'Keeffe</h3>
<p>For seven decades, Georgia O'Keeffe (1887–1986) was a major figure in American art. Remarkably, she remained independent from shifting art trends and her work stayed true to her own vision, which was based on finding the essential, abstract forms in nature. With exceptionally keen powers of observation and great finesse with a paintbrush, she recorded subtle nuances of colour, shape, and light that enlivened her paintings and attracted a wide audience.</p>
<p>Born in 1887 near Sun Prairie, Wisconsin to cattle breeders Francis and Ida O'Keeffe, Georgia was raised on their farm along with her six siblings. By the time she graduated from high school in 1905, she had determined to make her way as an artist. She studied the techniques of traditional painting at the Art Institute of Chicago school (1905) and the Art Students League of New York (1907–8). After attending university and then training college, she became an art teacher and taught in elementary schools, high schools, and colleges in Virginia, Texas, and South Carolina from 1911 to 1918.</p>
<p>During this period, O'Keeffe began to experiment with creating abstract compositions in charcoal, and produced a series of innovative drawings that led her art in a new direction. She sent some of these drawings to a friend in New York, who showed them to art collector and photographer Alfred Stieglitz in January 1916. Stieglitz was impressed, and exhibited the drawings later that year at his gallery on Fifth Avenue, New York City, where the works of many avant-garde artists and photographers were introduced to the American public.</p>
<p>With Stieglitz's encouragement and promise of financial support, O'Keeffe arrived in New York in June 1918 to begin a career as an artist. For the next three decades, Stieglitz vigorously promoted her work in twenty-two solo exhibitions and numerous group installations. The two were married in 1924. The ups and downs of their personal and professional relationship were recorded in Stieglitz's celebrated black-and-white portraits of O'Keeffe, taken over the course of twenty years (1917–37).</p>
<p>By the mid-1920s, O'Keeffe was recognized as one of America's most important and successful artists, widely known for the architectural pictures that dramatically depict the soaring skyscrapers of New York. But most often, she painted botanical subjects, inspired by annual trips to the Stieglitz family summer home. In her magnified images depicting flowers, begun in 1924, O'Keeffe brings the viewer right into the picture.</p>
<p>Enlarging the tiniest details to fill an entire metre-wide canvas emphasized their shapes and lines and made them appear abstract. Such daring compositions helped establish O'Keeffe's reputation as an innovative modernist.</p>
<p>In 1929, O'Keeffe made her first extended trip to the state of New Mexico. It was a visit that had a lasting impact on her life, and an immediate effect on her work. Over the next two decades she made almost annual trips to New Mexico, staying up to six months there, painting in relative solitude, then returning to New York each winter to exhibit the new work at Stieglitz's gallery. This pattern continued until she moved permanently to New Mexico in 1949.</p>
<p>There, O'Keeffe found new inspiration: at first, it was the numerous sun-bleached bones she came across in the state's rugged terrain that sparked her imagination. Two of her earliest and most celebrated Southwestern paintings exquisitely reproduce a cow skull's weathered surfaces, jagged edges, and irregular openings. Later, she also explored another variation on this theme in her large series of Pelvis pictures, which focused on the contrasts between convex and concave surfaces, and solid and open spaces.</p>
<p>However, it was the region's spectacular landscape, with its unusual geological formations, vivid colours, clarity of light, and exotic vegetation, that held the artist's imagination for more than four decades. Often, she painted the rocks, cliffs, and mountains in striking close-up, just as she had done with her botanical subjects.</p>
<p>O'Keeffe eventually owned two homes in New Mexico — the first, her summer retreat at Ghost Ranch, was nestled beneath 200-metre cliffs, while the second, used as her winter residence, was in the small town of Abiquiú. While both locales provided a wealth of imagery for her paintings, one feature of the Abiquiú house — the large walled patio with its black door — was particularly inspirational. In more than thirty pictures between 1946 and 1960, she reinvented the patio into an abstract arrangement of geometric shapes.</p>
<p>From the 1950s into the 1970s, O'Keeffe travelled widely, making trips to Asia, the Middle East, and Europe. Flying in planes inspired her last two major series — aerial views of rivers and expansive paintings of the sky viewed from just above clouds. In both series, O'Keeffe increased the size of her canvases, sometimes to mural proportions, reflecting perhaps her newly expanded view of the world. When in 1965 she successfully translated one of her cloud motifs to a monumental canvas measuring 6 metres in length (with the help of assistants), it was an enormous challenge and a special feat for an artist nearing eighty years of age.</p>
<p>The last two decades of the artist's life were relatively unproductive as ill health and blindness hindered her ability to work. O'Keeffe died in 1986 at the age of ninety-eight, but her rich legacy of some 900 paintings has continued to attract subsequent generations of artists and art lovers who derive inspiration from these very American images.</p>`,
            groups: [
              {
                instr: "Questions 1–7<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<h4 class="center">The life and work of Georgia O'Keeffe</h4>
<ul>
  <li>studied art, then worked as a [[1]] in various places in the USA</li>
  <li>created drawings using [[2]] which were exhibited in New York City</li>
  <li>moved to New York and became famous for her paintings of the city's [[3]]</li>
  <li>produced a series of innovative close-up paintings of [[4]]</li>
  <li>went to New Mexico and was initially inspired to paint the many [[5]] that could be found there</li>
  <li>continued to paint various features that together formed the dramatic [[6]] of New Mexico for over forty years</li>
  <li>travelled widely by plane in later years, and painted pictures of clouds and [[7]] seen from above</li>
</ul>`
              },
              {
                instr: "Questions 8–13<br>Do the following statements agree with the information given in Reading Passage 1?<br><b>TRUE</b> if the statement agrees with the information<br><b>FALSE</b> if the statement contradicts the information<br><b>NOT GIVEN</b> if there is no information on this",
                type: "choice",
                choices: ["TRUE", "FALSE", "NOT GIVEN"],
                items: [
                  { q: 8, text: "Georgia O'Keeffe's style was greatly influenced by the changing fashions in art over the seven decades of her career." },
                  { q: 9, text: "When O'Keeffe finished high school, she had already made her mind up about the career that she wanted." },
                  { q: 10, text: "Alfred Stieglitz first discovered O'Keeffe's work when she sent some abstract drawings to his gallery in New York City." },
                  { q: 11, text: "O'Keeffe was the subject of Stieglitz's photographic work for many years." },
                  { q: 12, text: "O'Keeffe's paintings of the patio of her house in Abiquiú were among the artist's favourite works." },
                  { q: 13, text: "O'Keeffe produced a greater quantity of work during the 1950s to 1970s than at any other time in her life." }
                ]
              }
            ]
          },
          {
            title: "Adapting to the effects of climate change",
            text: `<h3>Adapting to the effects of climate change</h3>
<p><b>A</b> All around the world, nations are already preparing for, and adapting to, climate change and its impacts. Even if we stopped all CO<sub>2</sub> emissions tomorrow, we would continue to see the impact of the CO<sub>2</sub> already released since industrial times, with scientists forecasting that global warming would continue for around 40 years. In the meantime, ice caps would continue to melt and sea levels rise. Some countries and regions will suffer more extreme impacts from these changes than others. It's in these places that innovation is thriving.</p>
<p><b>B</b> In Miami Beach, Florida, USA, seawater isn't just breaching the island city's walls, it's seeping up through the ground, so the only way to save the city is to lift it up above sea level. Starting in the lowest and most vulnerable neighbourhoods, roads have been raised by as much as 61 centimetres. The elevation work was carried out as part of Miami Beach's ambitious but much-needed stormwater-management programme. In addition to the road adaptations, the city has set up new pumps that can remove up to 75,000 litres of water per minute. In the face of floods, climate-mitigation strategies have often been overlooked, says Yanira Pineda, a senior sustainability coordinator. She knows that they're essential and that the job is far from over. 'We know that in 20, 30, 40 years, we'll need to go back in there and adjust to the changing environment,' she says.</p>
<p><b>C</b> Seawalls are a staple strategy for many coastal communities, but on the soft, muddy northern shores of Java, Indonesia, they frequently collapse, further exacerbating coastal erosion. There have been many attempts to restore the island's coastal mangroves: ecosystems of trees and shrubs that help defend coastal areas by trapping sediment in their net-like root systems, elevating the sea bed and dampening the energy of waves and tidal currents. But Susanna Tol of the not-for-profit organisation Wetlands International says that, while hugely popular, the majority of mangrove-planting projects fail. So, Wetlands International started out with a different approach, building semi-permeable dams, made from bamboo poles and brushwood, to mimic the role of mangrove roots and create favourable conditions for mangroves to grow back naturally. The programme has seen moderate success, mainly in areas with less subsidence. 'Unfortunately, traditional infrastructure is often single-solution focused,' says Tol. 'For long-term success, it's critical that we transition towards multifunctional approaches that embed natural processes and that engage and benefit communities and local decision-makers.'</p>
<p><b>D</b> As the floodwaters rose in the rice fields of the Mekong Delta in September 2018, four small houses rose with them. Homes in this part of Vietnam are traditionally built on stilts but these ones had been built to float. The modifications were made by the Buoyant Foundation Project, a not-for-profit organisation that has been researching and retrofitting amphibious houses since 2006. 'When I started this,' explains founder Elizabeth English, 'climate change was not on the tip of everybody's tongue, but this technology is becoming necessary in places that didn't previously need it.' It's much cheaper than permanently elevating houses, English explains — about a third of what it would cost to completely replace a building's foundations. It also avoids the problem of taller houses being at greater risk from wind damage. Another plus comes from the fact that amphibious structures can be sensitively adapted to meet cultural needs and match the kind of houses that are already common in a community.</p>
<p><b>E</b> Bangladesh is especially vulnerable to climate change. Most of the country is less than a metre above sea level and 80 per cent of its land lies on floodplains. 'Almost 35 million people living on the coastal belt of Bangladesh are currently affected by soil and water salinity,' says Raisa Chowdhury of the international development organisation ICCO Cooperation. Rather than fighting against it, one project is helping communities adapt to salt-affected soils. ICCO Cooperation has been working with 10,000 farmers in Bangladesh to start cultivating naturally salt-tolerant crops in the region. Certain varieties of carrot, potato, kohlrabi, cabbage and beetroot have been found to be better suited to salty soil than the rice and wheat that is typically grown there. Chowdhury says that the results are very visible, comparing a barren plot of land to the 'beautiful, lush green vegetable garden' sitting beside it, in which he and his team have been working with the farmers. Since the project began, farmers trained in saline agriculture have reported increases of two to three more harvests per year.</p>
<p><b>F</b> Greg Spotts from Los Angeles (LA) in the USA is chief sustainability officer of the city's street services department. He leads the Cool Streets LA programme, a series of pilot projects, which include the planting of trees and the installation of a 'cool pavement' system, designed to help reach the city's goal of bringing down its average temperature by 1.5°C. 'Urban cooling is literally a matter of life and death for our future in LA,' says Spotts. Using a Geographic Information System data mapping tool, the programme identified streets with low tree canopy cover in three of the city's neighbourhoods and covered them with a light-grey, light-reflecting coating, which had already been shown to lower road surface temperature in Los Angeles by 6°C. Spotts says one of these streets, in the Winnetka neighbourhood of San Fernando Valley, can now be seen as a pale crescent, the only cool spot on an otherwise red thermal image, from the International Space Station.</p>`,
            groups: [
              {
                instr: "Questions 14–17<br>Reading Passage 2 has six paragraphs, <b>A–F</b>.<br>Which paragraph contains the following information?",
                type: "match",
                letters: "ABCDEF",
                items: [
                  { q: 14, text: "how a type of plant functions as a natural protection for coastlines" },
                  { q: 15, text: "a prediction about how long it could take to stop noticing the effects of climate change" },
                  { q: 16, text: "a reference to the fact that a solution is particularly cost-effective" },
                  { q: 17, text: "a mention of a technology used to locate areas most in need of intervention" }
                ]
              },
              {
                instr: "Questions 18–22<br>Complete the sentences below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<p><b>18</b> The stormwater-management programme in Miami Beach has involved the installation of efficient [[18]].</p>
<p><b>19</b> The construction of [[19]] was the first stage of a project to ensure the success of mangroves in Indonesia.</p>
<p><b>20</b> As a response to rising floodwaters in the Mekong Delta, a not-for-profit organisation has been building houses that can [[20]].</p>
<p><b>21</b> Rising sea levels in Bangladesh have made it necessary to introduce various [[21]] that are suitable for areas of high salt content.</p>
<p><b>22</b> A project in LA has increased the number of [[22]] on the city's streets.</p>`
              },
              {
                instr: "Questions 23–26<br>Look at the following statements (Questions 23–26) and the list of people below.<br>Match each statement with the correct person, <b>A–E</b>.",
                type: "match",
                boxTitle: "List of People",
                box: [
                  ["A", "Yanira Pineda"],
                  ["B", "Susanna Tol"],
                  ["C", "Elizabeth English"],
                  ["D", "Raisa Chowdhury"],
                  ["E", "Greg Spotts"]
                ],
                items: [
                  { q: 23, text: "It is essential to adopt strategies which involve and help residents of the region." },
                  { q: 24, text: "Interventions which reduce heat are absolutely vital for our survival in this location." },
                  { q: 25, text: "More work will need to be done in future decades to deal with the impact of rising water levels." },
                  { q: 26, text: "The number of locations requiring action to adapt to flooding has grown in recent years." }
                ]
              }
            ]
          },
          {
            title: "A new role for livestock guard dogs",
            text: `<h3>A new role for livestock guard dogs</h3>
<p class="sub"><i>Livestock guard dogs, traditionally used to protect farm animals from predators, are now being used to protect the predators themselves</i></p>
<p><b>A</b> For thousands of years, livestock guard dogs worked alongside shepherds to protect their sheep, goats and cattle from predators such as wolves and bears. But in the 19th and 20th centuries, when such predators were largely exterminated, most guard dogs lost their jobs. In recent years, however, as increased efforts have been made to protect wild animals, predators have become more widespread again. As a result, farmers once more need to protect their livestock, and guard dogs are enjoying an unexpected revival.</p>
<p><b>B</b> Today there are around 50 breeds of guard dogs on duty in various parts of the world. These dogs are raised from an early age with the animals they will be watching and eventually these animals become the dog's family. The dogs will place themselves between the livestock and any threat, barking loudly. If necessary, they will chase away predators, but often their mere presence is sufficient. 'Their initial training is to make them understand that livestock is going to be their life,' says Dan Macon, a shepherd with three guard dogs. 'A fluffy white puppy is fun to be around, but too much human affection makes it a great dog for guarding the front porch, rather than a great livestock guard dog.'</p>
<p><b>C</b> The evidence indicates that guard dogs are highly effective. For example, in Portugal, biologist Silvia Ribeiro has found that more than 90 per cent of the farmers participating in a programme to train and use guard dogs to protect their herds against attack from wolves rate the performance of the dogs as very good or excellent. In a study carried out in Australia by Linda van Bommel and Chris Johnson at the University of Tasmania, more than 65 per cent of herders reported that predation stopped completely after they got the dogs, and almost all the rest saw a decrease in attacks. 'If they are managed and used properly, livestock guard dogs are the most efficient control method that we have in terms of the amount of livestock that they save from predation,' says van Bommel.</p>
<p><b>D</b> But today's guard dogs also have a new role — to help preserve the predators. It is hoped that reductions in livestock losses can make farmers more tolerant of predators and less likely to kill them. In Namibia, more than 90 per cent of cheetahs live outside protected areas, close to humans raising livestock. As a result, the cheetahs are often held responsible for animal losses, and large numbers have been killed by farmers. When guard dogs were introduced, more than 90 per cent of farmers reported a dramatic reduction in livestock losses, and said that as a result they were less likely to kill predators. Julie Young, at Utah State University in the US, believes this result applies widely. 'There is common ground from the livestock perspective and from the conservation perspective,' she says. 'If ranchers don't have a dead cow, they will not make a call to apply for a permit to kill a wolf.'</p>
<p><b>E</b> Looking at all the published evidence, Bethany Smith at Nottingham Trent University in the UK found that up to 88 per cent of farmers said they no longer killed predators after using dogs — but warned that such self-reported results must be taken with a pinch of salt. What's more, it is possible that livestock guard dogs merely displace predators to unprotected neighbouring properties, where their fate isn't recorded. 'In some regions, we work with almost every farmer, but in others only one or two have dogs,' says Ribeiro. 'If we are not working with everybody, we are transferring the wolf pressure to the neighbour's herd and he can use poison and kill an entire pack of wolves.'</p>
<p><b>F</b> Another concern is whether there may be unintended ecological effects of using guard dogs. Studies suggest that reducing deaths of one type of predator may have a negative impact on other species. The extent of this problem isn't known, but the consequences are clear in Namibia. Cheetahs aren't the only species that cause sheep and goat losses there: other predators also attack livestock. In 2015, researchers reported that in spite of the impact farmers obtaining guard dogs had on cheetahs, the number of jackals killed by dogs and people actually increased. Guard dogs have other ecological impacts too. They have been found to spread diseases to wild animals, including endangered Ethiopian wolves. They may also compete with other carnivores for food. And by creating a 'landscape of fear', their mere presence can influence the behaviour of prey animals.</p>
<p><b>G</b> The evidence so far, however, indicates that these consequences aren't always negative. Guard dogs can deliver unexpected benefits by protecting vulnerable wildlife from predators. For example, their presence has been found to protect birds which build their nests on the ground in fields, where foxes would normally raid them. Indeed, Australian researchers are now using dogs to enhance biodiversity and create refuges for species threatened by predation. So if we can get this right, there may be a bright future for guard dogs in promoting harmonious coexistence between humans and wildlife.</p>`,
            groups: [
              {
                instr: "Questions 27–31<br>Reading Passage 3 has seven paragraphs, <b>A–G</b>.<br>Which paragraph contains the following information?<br><i>NB You may use any letter more than once.</i>",
                type: "match",
                letters: "ABCDEFG",
                items: [
                  { q: 27, text: "an example of how one predator has been protected by the introduction of livestock guard dogs" },
                  { q: 28, text: "an optimistic suggestion about the possible positive developments in the use of livestock guard dogs" },
                  { q: 29, text: "a description of how the methods used by livestock guard dogs help to keep predators away" },
                  { q: 30, text: "claims by different academics that the use of livestock guard dogs is a successful way of protecting farmers' herds" },
                  { q: 31, text: "a reference to how livestock guard dogs gain their skills" }
                ]
              },
              {
                instr: "Questions 32–36<br>Look at the following statements (Questions 32–36) and the list of people below.<br>Match each statement with the correct person, <b>A–E</b>.",
                type: "match",
                boxTitle: "List of people",
                box: [
                  ["A", "Dan Macon"],
                  ["B", "Silvia Ribeiro"],
                  ["C", "Linda van Bommel"],
                  ["D", "Julie Young"],
                  ["E", "Bethany Smith"]
                ],
                items: [
                  { q: 32, text: "The use of guard dogs may save the lives of both livestock and wild animals." },
                  { q: 33, text: "Claims of a change in behaviour from those using livestock guard dogs may not be totally accurate." },
                  { q: 34, text: "There may be negative results if the use of livestock guard dogs is not sufficiently widespread." },
                  { q: 35, text: "Livestock guard dogs are the best way of protecting farm animals, as long as the dogs are appropriately handled." },
                  { q: 36, text: "Teaching a livestock guard dog how to do its work needs a different focus from teaching a house guard dog." }
                ]
              },
              {
                instr: "Questions 37–40<br>Complete the summary below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<h4 class="center">Unintended ecological effects of using guard dogs</h4>
<p>In Namibia, livestock guard dogs have been used to protect domestic animals from attacks by cheetahs. This has led to a rise in the deaths of other predators, particularly [[37]]. In addition, it has been suggested that the dogs could have [[38]] which may affect other species, and that they may reduce the amount of [[39]] available to certain wild animals.</p>
<p>On the other hand, these dogs may help birds by protecting their nests. These might otherwise be threatened by predators such as [[40]].</p>`
              }
            ]
          }
        ],
        answers: {
          1: "teacher", 2: "charcoal", 3: "skyscrapers|skycrapers", 4: "flowers", 5: "bones", 6: "landscape", 7: "rivers",
          8: "FALSE", 9: "TRUE", 10: "FALSE", 11: "TRUE", 12: "NOT GIVEN", 13: "NOT GIVEN",
          14: "C", 15: "A", 16: "D", 17: "F",
          18: "pumps", 19: "dams", 20: "float", 21: "crops", 22: "trees",
          23: "B", 24: "E", 25: "A", 26: "C",
          27: "D", 28: "G", 29: "B", 30: "C", 31: "B",
          32: "D", 33: "E", 34: "B", 35: "C", 36: "A",
          37: "jackals", 38: "diseases", 39: "food", 40: "foxes"
        }
      }
    }
  ]
});
