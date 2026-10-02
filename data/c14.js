/* Cambridge IELTS 14 — Listening, transcribed from "Cambridge 14.pdf" */
IELTS.addBook({
  id: 14,
  title: "Cambridge IELTS 14",
  audioDir: "Cambridge 14/Audio 14/",
  tests: [
    // ================= TEST 1 =================
    {
      n: 1,
      listening: {
        parts: [
          {
            title: "Crime Report Form",
            audio: "C14T1S1.mp3",
            groups: [
              {
                instr: "Complete the form below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">CRIME REPORT FORM</h4>
<table class="grid">
<tr><td><b>Type of crime:</b></td><td>theft</td></tr>
<tr><td colspan="2"><b>Personal information</b></td></tr>
<tr><td><i>Example</i><br>Name</td><td><br>Louise <u>Taylor</u></td></tr>
<tr><td>Nationality</td><td>[[1]]</td></tr>
<tr><td>Date of birth</td><td>14 December 1977</td></tr>
<tr><td>Occupation</td><td>interior designer</td></tr>
<tr><td>Reason for visit</td><td>business (to buy antique [[2]])</td></tr>
<tr><td>Length of stay</td><td>two months</td></tr>
<tr><td>Current address</td><td>[[3]] Apartments (No 15)</td></tr>
<tr><td colspan="2"><b>Details of theft</b></td></tr>
<tr><td>Items stolen</td><td>– a wallet containing approximately £ [[4]]<br>– a [[5]]</td></tr>
<tr><td>Date of theft</td><td>[[6]]</td></tr>
<tr><td colspan="2"><b>Possible time and place of theft</b></td></tr>
<tr><td>Location</td><td>outside the [[7]] at about 4 pm</td></tr>
<tr><td>Details of suspect</td><td>– some boys asked for the [[8]] then ran off<br>– one had a T-shirt with a picture of a tiger<br>– he was about 12, slim build with [[9]] hair</td></tr>
<tr><td colspan="2"><b>Crime reference number allocated</b></td></tr>
<tr><td></td><td>[[10]]</td></tr>
</table>`
              }
            ]
          },
          {
            title: "Induction talk for new apprentices",
            audio: "C14T1S2.mp3",
            groups: [
              {
                instr: "Questions 11 and 12<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [11, 12],
                text: "Which <b>TWO</b> pieces of advice for the first week of an apprenticeship does the manager give?",
                options: ["get to know colleagues", "learn from any mistakes", "ask lots of questions", "react positively to feedback", "enjoy new challenges"]
              },
              {
                instr: "Questions 13 and 14<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [13, 14],
                text: "Which <b>TWO</b> things does the manager say mentors can help with?",
                options: ["confidence-building", "making career plans", "completing difficult tasks", "making a weekly timetable", "reviewing progress"]
              },
              {
                instr: "Questions 15–20<br>What does the manager say about each of the following aspects of the company policy for apprentices?<br>Write the correct letter, <b>A</b>, <b>B</b> or <b>C</b>, next to Questions 15–20.",
                type: "match",
                boxTitle: "",
                box: [["A", "It is encouraged."], ["B", "There are some restrictions."], ["C", "It is against the rules."]],
                items: [
                  { q: 15, text: "Using the internet" }, { q: 16, text: "Flexible working" }, { q: 17, text: "Booking holidays" },
                  { q: 18, text: "Working overtime" }, { q: 19, text: "Wearing trainers" }, { q: 20, text: "Bringing food to work" }
                ]
              }
            ]
          },
          {
            title: "Cities built by the sea",
            audio: "C14T1S3.mp3",
            groups: [
              {
                instr: "Questions 21–25<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "Cities built by the sea",
                items: [
                  { q: 21, text: "Carla and Rob were surprised to learn that coastal cities", options: ["contain nearly half the world's population.", "include most of the world's largest cities.", "are growing twice as fast as other cities."] },
                  { q: 22, text: "According to Rob, building coastal cities near to rivers", options: ["may bring pollution to the cities.", "may reduce the land available for agriculture.", "may mean the countryside is spoiled by industry."] },
                  { q: 23, text: "What mistake was made when building water drainage channels in Miami in the 1950s?", options: ["There were not enough of them.", "They were made of unsuitable materials.", "They did not allow for the effects of climate change."] },
                  { q: 24, text: "What do Rob and Carla think that the authorities in Miami should do immediately?", options: ["take measures to restore ecosystems", "pay for a new flood prevention system", "stop disposing of waste materials into the ocean"] },
                  { q: 25, text: "What do they agree should be the priority for international action?", options: ["greater coordination of activities", "more sharing of information", "agreement on shared policies"] }
                ]
              },
              {
                instr: "Questions 26–30<br>What decision do the students make about each of the following parts of their presentation?<br>Choose <b>FIVE</b> answers from the box and write the correct letter, <b>A–G</b>, next to Questions 26–30.",
                type: "match",
                boxTitle: "Decisions",
                box: [["A", "use visuals"], ["B", "keep it short"], ["C", "involve other students"], ["D", "check the information is accurate"], ["E", "provide a handout"], ["F", "focus on one example"], ["G", "do online research"]],
                items: [
                  { q: 26, text: "Historical background" }, { q: 27, text: "Geographical factors" }, { q: 28, text: "Past mistakes" },
                  { q: 29, text: "Future risks" }, { q: 30, text: "International implications" }
                ]
              }
            ]
          },
          {
            title: "Marine renewable energy (ocean energy)",
            audio: "C14T1S4.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Marine renewable energy (ocean energy)</h4>
<p><b>Introduction</b></p>
<p>More energy required because of growth in population and [[31]]<br>What's needed:</p>
<ul><li>renewable energy sources</li><li>methods that won't create pollution</li></ul>
<p><b>Wave energy</b></p>
<p>Advantage: waves provide a [[32]] source of renewable energy<br>Electricity can be generated using offshore or onshore systems<br>Onshore systems may use a reservoir<br>Problems:</p>
<ul><li>waves can move in any [[33]]</li><li>movement of sand, etc. on the [[34]] of the ocean may be affected</li></ul>
<p><b>Tidal energy</b></p>
<p>Tides are more [[35]] than waves<br>Planned tidal lagoon in Wales:</p>
<ul>
<li>will be created in a [[36]] at Swansea</li>
<li>breakwater (dam) containing 16 turbines</li>
<li>rising tide forces water through turbines, generating electricity</li>
<li>stored water is released through [[37]], driving the turbines in the reverse direction</li>
</ul>
<p>Advantages:</p>
<ul><li>not dependent on weather</li><li>no [[38]] is required to make it work</li><li>likely to create a number of [[39]]</li></ul>
<p>Problem:</p>
<ul><li>may harm fish and birds, e.g. by affecting [[40]] and building up silt</li></ul>
<p><b>Ocean thermal energy conversion</b></p>
<p>Uses a difference in temperature between the surface and lower levels<br>Water brought to the surface in a pipe</p>`
              }
            ]
          }
        ],
        answers: {
          1: "Canadian", 2: "furniture", 3: "Park", 4: "250( sterling)", 5: "phone", 6: "10(th) September|September 10(th)|10/9|10 Sept", 7: "museum", 8: "time", 9: "blond(e)", 10: "87954 82361|8795482361",
          11: "A", 12: "C", 13: "B", 14: "E", 15: "B", 16: "B", 17: "C", 18: "A", 19: "A", 20: "C",
          21: "B", 22: "A", 23: "C", 24: "B", 25: "A", 26: "B", 27: "A", 28: "F", 29: "G", 30: "C",
          31: "industry", 32: "constant", 33: "direction", 34: "floor", 35: "predictable", 36: "bay", 37: "gates", 38: "fuel", 39: "jobs", 40: "migration"
        }
      }
    }
    ,
    // ================= TEST 2 =================
    {
      n: 2,
      listening: {
        parts: [
          {
            title: "Total Health Clinic",
            audio: "C14T2S1.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">TOTAL HEALTH CLINIC</h4>
<p><b>PATIENT DETAILS</b></p>
<p><b>Personal information</b></p>
<p><i>Example</i><br>Name &nbsp; Julie Anne <u>Garcia</u></p>
<table class="grid">
<tr><td>Contact phone</td><td>[[1]]</td></tr>
<tr><td>Date of birth</td><td>[[2]], 1992</td></tr>
<tr><td>Occupation</td><td>works as a [[3]]</td></tr>
<tr><td>Insurance company</td><td>[[4]] Life Insurance</td></tr>
<tr><td colspan="2"><b>Details of the problem</b></td></tr>
<tr><td>Type of problem</td><td>pain in her left [[5]]</td></tr>
<tr><td>When it began</td><td>[[6]] ago</td></tr>
<tr><td>Action already taken</td><td>has taken painkillers and applied ice</td></tr>
<tr><td colspan="2"><b>Other information</b></td></tr>
<tr><td>Sports played</td><td>belongs to a [[7]] club<br>goes [[8]] regularly</td></tr>
<tr><td>Medical history</td><td>injured her [[9]] last year<br>no allergies<br>no regular medication apart from [[10]]</td></tr>
</table>`
              }
            ]
          },
          {
            title: "Visit to Branley Castle",
            audio: "C14T2S2.mp3",
            groups: [
              {
                instr: "Questions 11–15<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "Visit to Branley Castle",
                items: [
                  { q: 11, text: "Before Queen Elizabeth I visited the castle in 1576,", options: ["repairs were carried out to the guest rooms.", "a new building was constructed for her.", "a fire damaged part of the main hall."] },
                  { q: 12, text: "In 1982, the castle was sold to", options: ["the government.", "the Fenys family.", "an entertainment company."] },
                  { q: 13, text: "In some of the rooms, visitors can", options: ["speak to experts on the history of the castle.", "interact with actors dressed as famous characters.", "see models of historical figures moving and talking."] },
                  { q: 14, text: "In the castle park, visitors can", options: ["see an 800-year-old tree.", "go to an art exhibition.", "visit a small zoo."] },
                  { q: 15, text: "At the end of the visit, the group will have", options: ["afternoon tea in the conservatory.", "the chance to meet the castle's owners.", "a photograph together on the Great Staircase."] }
                ]
              },
              {
                instr: "Questions 16–20<br>Label the plan below.<br>Write the correct letter, <b>A–H</b>, next to Questions 16–20.",
                type: "match",
                image: "assets/c14/t2-l-map.png",
                letters: "ABCDEFGH",
                items: [
                  { q: 16, text: "Starting point for walking the walls" }, { q: 17, text: "Bow and arrow display" },
                  { q: 18, text: "Hunting birds display" }, { q: 19, text: "Traditional dancing" }, { q: 20, text: "Shop" }
                ]
              }
            ]
          },
          {
            title: "Woolly mammoths on St Paul's Island",
            audio: "C14T2S3.mp3",
            groups: [
              {
                instr: "Questions 21–24<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "Woolly mammoths on St Paul's Island",
                items: [
                  { q: 21, text: "How will Rosie and Martin introduce their presentation?", options: ["with a drawing of woolly mammoths in their natural habitat", "with a timeline showing when woolly mammoths lived", "with a video clip about woolly mammoths"] },
                  { q: 22, text: "What was surprising about the mammoth tooth found by Russell Graham?", options: ["It was still embedded in the mammoth's jawbone.", "It was from an unknown species of mammoth.", "It was not as old as mammoth remains from elsewhere."] },
                  { q: 23, text: "The students will use an animated diagram to demonstrate how the mammoths", options: ["became isolated on the island.", "spread from the island to other areas.", "coexisted with other animals on the island."] },
                  { q: 24, text: "According to Martin, what is unusual about the date of the mammoths' extinction on the island?", options: ["how exact it is", "how early it is", "how it was established"] }
                ]
              },
              {
                instr: "Questions 25–30<br>What action will the students take for each of the following sections of their presentation?<br>Choose <b>SIX</b> answers from the box and write the correct letter, <b>A–H</b>, next to Questions 25–30.",
                type: "match",
                boxTitle: "Actions",
                box: [["A", "make it more interactive"], ["B", "reduce visual input"], ["C", "add personal opinions"], ["D", "contact one of the researchers"], ["E", "make detailed notes"], ["F", "find information online"], ["G", "check timing"], ["H", "organise the content more clearly"]],
                items: [
                  { q: 25, text: "Introduction" }, { q: 26, text: "Discovery of the mammoth tooth" },
                  { q: 27, text: "Initial questions asked by the researchers" }, { q: 28, text: "Further research carried out on the island" },
                  { q: 29, text: "Findings and possible explanations" }, { q: 30, text: "Relevance to the present day" }
                ]
              }
            ]
          },
          {
            title: "The history of weather forecasting",
            audio: "C14T2S4.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">The history of weather forecasting</h4>
<p><b>Ancient cultures</b></p>
<ul>
<li>many cultures believed that floods and other disasters were involved in the creation of the world</li>
<li>many cultures invented [[31]] and other ceremonies to make the weather gods friendly</li>
<li>people needed to observe and interpret the sky to ensure their [[32]]</li>
<li>around 650 BC, Babylonians started forecasting, using weather phenomena such as [[33]]</li>
<li>by 300 BC, the Chinese had a calendar made up of a number of [[34]] connected with the weather</li>
</ul>
<p><b>Ancient Greeks</b></p>
<ul>
<li>a more scientific approach</li>
<li>Aristotle tried to explain the formation of various weather phenomena</li>
<li>Aristotle also described haloes and [[35]]</li>
</ul>
<p><b>Middle Ages</b></p>
<ul>
<li>Aristotle's work considered accurate</li>
<li>many proverbs, e.g. about the significance of the colour of the [[36]], passed on accurate information.</li>
</ul>
<p><b>15th–19th centuries</b></p>
<ul>
<li>15th century: scientists recognised value of [[37]] for the first time</li>
<li>Galileo invented the [[38]]</li>
<li>Pascal showed relationship between atmospheric pressure and altitude</li>
<li>from the 17th century, scientists could measure atmospheric pressure and temperature</li>
<li>18th century: Franklin identified the movement of [[39]]</li>
<li>19th century: data from different locations could be sent to the same place by [[40]]</li>
</ul>`
              }
            ]
          }
        ],
        answers: {
          1: "219 442 9785", 2: "10(th) October|October 10(th)", 3: "manager", 4: "Cawley", 5: "knee", 6: "3 weeks|three weeks", 7: "tennis", 8: "running", 9: "shoulder", 10: "vitamins",
          11: "B", 12: "C", 13: "C", 14: "B", 15: "A", 16: "H", 17: "D", 18: "F", 19: "A", 20: "E",
          21: "B", 22: "C", 23: "A", 24: "A", 25: "E", 26: "D", 27: "A", 28: "H", 29: "G", 30: "C",
          31: "dances", 32: "survival", 33: "clouds", 34: "festivals", 35: "comets", 36: "sky", 37: "instruments", 38: "thermometer", 39: "storms", 40: "telegraph"
        }
      }
    }
    ,
    // ================= TEST 3 =================
    {
      n: 3,
      listening: {
        parts: [
          {
            title: "Flanders Conference Hotel",
            audio: "C14T3S1.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Flanders Conference Hotel</h4>
<p><i>Example</i><br>Customer Services Manager: <u>Angela</u></p>
<p><b>Date available</b></p>
<ul><li>weekend beginning February 4th</li></ul>
<p><b>Conference facilities</b></p>
<ul>
<li>the [[1]] room for talks (projector and [[2]] available)</li>
<li>area for coffee and an [[3]]</li>
<li>free [[4]] throughout</li>
<li>a standard buffet lunch costs $ [[5]] per head</li>
</ul>
<p><b>Accommodation</b></p>
<ul><li>Rooms will cost $ [[6]] including breakfast.</li></ul>
<p><b>Other facilities</b></p>
<ul><li>The hotel also has a spa and rooftop [[7]].</li><li>There's a free shuttle service to the [[8]].</li></ul>
<p><b>Location</b></p>
<ul><li>Wilby Street (quite near the [[9]])</li><li>near to restaurants and many [[10]]</li></ul>`
              }
            ]
          },
          {
            title: "Volunteering",
            audio: "C14T3S2.mp3",
            groups: [
              {
                instr: "Questions 11 and 12<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [11, 12],
                text: "Which <b>TWO</b> activities that volunteers do are mentioned?",
                options: ["decorating", "cleaning", "delivering meals", "shopping", "childcare"]
              },
              {
                instr: "Questions 13 and 14<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [13, 14],
                text: "Which <b>TWO</b> ways that volunteers can benefit from volunteering are mentioned?",
                options: ["learning how to be part of a team", "having a sense of purpose", "realising how lucky they are", "improved ability at time management", "boosting their employment prospects"]
              },
              {
                instr: "Questions 15–20<br>What has each of the following volunteers helped someone to do?<br>Choose <b>SIX</b> answers from the box and write the correct letter, <b>A–G</b>, next to Questions 15–20.",
                type: "match",
                boxTitle: "What volunteers have helped people to do",
                box: [["A", "overcome physical difficulties"], ["B", "rediscover skills not used for a long time"], ["C", "improve their communication skills"], ["D", "solve problems independently"], ["E", "escape isolation"], ["F", "remember past times"], ["G", "start a new hobby"]],
                items: [
                  { q: 15, text: "Habib" }, { q: 16, text: "Consuela" }, { q: 17, text: "Minh" },
                  { q: 18, text: "Tanya" }, { q: 19, text: "Alexei" }, { q: 20, text: "Juba" }
                ]
              }
            ]
          },
          {
            title: "Background on school marching band",
            audio: "C14T3S3.mp3",
            groups: [
              {
                instr: "Questions 21–26<br>Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Background on school marching band</h4>
<p>It consists of around [[21]] students.</p>
<p>It is due to play in a [[22]] band competition.</p>
<p>It has been invited to play in the town's [[23]].</p>
<p>They have listened to a talk by a [[24]].</p>
<p>Joe will discuss a [[25]] with the band.</p>
<p>Joe hopes the band will attend a [[26]] next month.</p>`
              },
              {
                instr: "Questions 27–30<br>What problem does Joe mention in connection with each of the following band members?<br>Choose <b>FOUR</b> answers from the box and write the correct letter, <b>A–F</b>, next to Questions 27–30.",
                type: "match",
                boxTitle: "Problems",
                box: [["A", "makes a lot of mistakes in rehearsals"], ["B", "keeps making unhelpful suggestions"], ["C", "has difficulty with rhythm"], ["D", "misses too many rehearsals"], ["E", "has a health problem"], ["F", "doesn't mix with other students"]],
                items: [
                  { q: 27, text: "flautist" }, { q: 28, text: "trumpeter" }, { q: 29, text: "trombonist" }, { q: 30, text: "percussionist" }
                ]
              }
            ]
          },
          {
            title: "Concerts in university arts festival",
            audio: "C14T3S4.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Concerts in university arts festival</h4>
<p><b>Concert 1</b></p>
<ul>
<li>Australian composer: Liza Lim</li>
<li>studied piano and [[31]] before turning to composition</li>
<li>performers and festivals around the world have given her a lot of commissions</li>
<li>compositions show a great deal of [[32]] and are drawn from various cultural sources</li>
<li>her music is very expressive and also [[33]]</li>
<li>festival will include her [[34]] called <i>The Oresteia</i></li>
<li>Lim described the sounds in <i>The Oresteia</i> as [[35]]</li>
<li>British composers: Ralph Vaughan Williams, Frederick Delius</li>
</ul>
<p><b>Concert 2</b></p>
<ul>
<li>British composers: Benjamin Britten, Judith Weir</li>
<li>Australian composer: Ross Edwards</li>
<li>festival will include <i>The Tower of Remoteness</i>, inspired by nature</li>
<li><i>The Tower of Remoteness</i> is performed by piano and [[36]]</li>
<li>compositions include music for children</li>
<li>celebrates Australia's cultural [[37]]</li>
</ul>
<p><b>Concert 3</b></p>
<ul>
<li>Australian composer: Carl Vine</li>
<li>played cornet then piano</li>
<li>studied [[38]] before studying music</li>
<li>worked in Sydney as a pianist and composer</li>
<li>became well known as composer of music for [[39]]</li>
<li>festival will include his music for the 1996 [[40]]</li>
<li>British composers: Edward Elgar, Thomas Adès</li>
</ul>`
              }
            ]
          }
        ],
        answers: {
          1: "Tesla", 2: "microphone", 3: "exhibition", 4: "wifi|wi-fi", 5: "45", 6: "135", 7: "pool", 8: "airport", 9: "sea", 10: "clubs",
          11: "A", 12: "E", 13: "B", 14: "E", 15: "F", 16: "A", 17: "E", 18: "G", 19: "D", 20: "C",
          21: "50|fifty", 22: "regional", 23: "carnival", 24: "drummer", 25: "film", 26: "parade", 27: "D", 28: "B", 29: "E", 30: "F",
          31: "violin", 32: "energy", 33: "complex", 34: "opera", 35: "disturbing", 36: "clarinet", 37: "diversity", 38: "physics", 39: "dance", 40: "Olympics"
        }
      }
    }
    ,
    // ================= TEST 4 =================
    {
      n: 4,
      listening: {
        parts: [
          {
            title: "Enquiry about booking hotel room for event",
            audio: "C14T4S1.mp3",
            groups: [
              {
                instr: "Questions 1–7<br>Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Enquiry about booking hotel room for event</h4>
<p><i>Example</i><br>Andrew is the <u>Events</u> Manager</p>
<p><b>Rooms</b></p>
<p>Adelphi Room</p>
<ul>
<li>number of people who can sit down to eat: [[1]]</li>
<li>has a gallery suitable for musicians</li>
<li>can go out and see the [[2]] in pots on the terrace</li>
<li>terrace has a view of a group of [[3]]</li>
</ul>
<p>Carlton Room</p>
<ul><li>number of people who can sit down to eat: 110</li><li>has a [[4]] view of the lake</li></ul>
<p><b>Options</b></p>
<p>Master of Ceremonies:</p>
<ul><li>can give a [[5]] while people are eating</li><li>will provide [[6]] if there are any problems</li></ul>
<p>Accommodation:</p>
<ul><li>in hotel rooms or [[7]]</li></ul>`
              },
              {
                instr: "Questions 8–10<br>What is said about using each of the following hotel facilities?<br>Choose <b>THREE</b> answers from the box and write the correct letter, <b>A</b>, <b>B</b> or <b>C</b>, next to Questions 8–10.",
                type: "match",
                boxTitle: "Availability",
                box: [["A", "included in cost of hiring room"], ["B", "available at extra charge"], ["C", "not available"]],
                items: [{ q: 8, text: "outdoor swimming pool" }, { q: 9, text: "gym" }, { q: 10, text: "tennis courts" }]
              }
            ]
          },
          {
            title: "Excursions",
            audio: "C14T4S2.mp3",
            groups: [
              {
                instr: "Questions 11–16<br>What information does the speaker give about each of the following excursions?<br>Choose <b>SIX</b> answers from the box and write the correct letter, <b>A–H</b>, next to Questions 11–16.",
                type: "match",
                boxTitle: "Information",
                box: [["A", "all downhill"], ["B", "suitable for beginners"], ["C", "only in good weather"], ["D", "food included"], ["E", "no charge"], ["F", "swimming possible"], ["G", "fully booked today"], ["H", "transport not included"]],
                items: [
                  { q: 11, text: "dolphin watching" }, { q: 12, text: "forest walk" }, { q: 13, text: "cycle trip" },
                  { q: 14, text: "local craft tour" }, { q: 15, text: "observatory trip" }, { q: 16, text: "horse riding" }
                ]
              },
              {
                instr: "Questions 17 and 18<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [17, 18],
                text: "Which <b>TWO</b> things does the speaker say about the attraction called <i>Musical Favourites</i>?",
                options: ["You pay extra for drinks.", "You must book it in advance.", "You get a reduction if you buy two tickets.", "You can meet the performers.", "You can take part in the show."]
              },
              {
                instr: "Questions 19 and 20<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [19, 20],
                text: "Which <b>TWO</b> things does the speaker say about the <i>Castle Feast</i>?",
                options: ["Visitors can dance after the meal.", "There is a choice of food.", "Visitors wear historical costume.", "Knives and forks are not used.", "The entertainment includes horse races."]
              }
            ]
          },
          {
            title: "Children's literature",
            audio: "C14T4S3.mp3",
            groups: [
              {
                instr: "Questions 21–25<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                items: [
                  { q: 21, text: "What does Trevor find interesting about the purpose of children's literature?", options: ["the fact that authors may not realise what values they're teaching", "the fact that literature can be entertaining and educational at the same time", "the fact that adults expect children to imitate characters in literature"] },
                  { q: 22, text: "Trevor says the module about the purpose of children's literature made him", options: ["analyse some of the stories that his niece reads.", "wonder how far popularity reflects good quality.", "decide to start writing some children's stories."] },
                  { q: 23, text: "Stephanie is interested in the Pictures module because", options: ["she intends to become an illustrator.", "she can remember beautiful illustrations from her childhood.", "she believes illustrations are more important than words."] },
                  { q: 24, text: "Trevor and Stephanie agree that comics", options: ["are inferior to books.", "have the potential for being useful.", "discourage children from using their imagination."] },
                  { q: 25, text: "With regard to books aimed at only boys or only girls, Trevor was surprised", options: ["how long the distinction had gone unquestioned.", "how few books were aimed at both girls and boys.", "how many children enjoyed books intended for the opposite sex."] }
                ]
              },
              {
                instr: "Questions 26–30<br>What comment is made about each of these stories?<br>Choose <b>FIVE</b> answers from the box and write the correct letter, <b>A–G</b>, next to Questions 26–30.",
                type: "match",
                boxTitle: "Comments",
                box: [["A", "translated into many other languages"], ["B", "hard to read"], ["C", "inspired a work in a different area of art"], ["D", "more popular than the author's other works"], ["E", "original title refers to another book"], ["F", "started a new genre"], ["G", "unlikely topic"]],
                items: [
                  { q: 26, text: "Perrault's fairy tales" }, { q: 27, text: "<i>The Swiss Family Robinson</i>" },
                  { q: 28, text: "<i>The Nutcracker and The Mouse King</i>" }, { q: 29, text: "<i>The Lord of the Rings</i>" }, { q: 30, text: "<i>War Horse</i>" }
                ]
              }
            ]
          },
          {
            title: "The hunt for sunken settlements and ancient shipwrecks",
            audio: "C14T4S4.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">The hunt for sunken settlements and ancient shipwrecks</h4>
<p><b>ATLIT-YAM</b></p>
<ul>
<li>was a village on coast of eastern Mediterranean</li>
<li>thrived until about 7,000 BC</li>
<li>stone homes had a courtyard</li>
<li>had a semicircle of large stones round a [[31]]</li>
<li>cause of destruction unknown – now under the sea</li>
<li>biggest settlement from the prehistoric period found on the seabed</li>
<li>research carried out into structures, [[32]] and human remains</li>
</ul>
<p><b>TRADITIONAL AUTONOMOUS UNDERWATER VEHICLES (AUVs)</b></p>
<ul><li>used in the oil industry, e.g. to make [[33]]</li><li>problems: they were expensive and [[34]]</li></ul>
<p><b>LATEST AUVs</b></p>
<ul><li>much easier to use, relatively cheap, sophisticated</li></ul>
<p><b>Tests:</b></p>
<ul><li>Marzamemi, Sicily: found ancient Roman ships carrying architectural elements made of [[35]]</li></ul>
<p><b>Underwater internet:</b></p>
<ul>
<li>[[36]] is used for short distance communication, acoustic waves for long distance</li>
<li>plans for communication with researchers by satellite</li>
<li>AUV can send data to another AUV that has better [[37]], for example</li>
</ul>
<p><b>Planned research in Gulf of Baratti:</b></p>
<ul><li>to find out more about wrecks of ancient Roman ships, including
  <ul><li>one carrying [[38]] supplies; tablets may have been used for cleaning the [[39]]</li>
  <li>others carrying containers of olive oil or [[40]]</li></ul></li></ul>`
              }
            ]
          }
        ],
        answers: {
          1: "85|eighty-five|eighty five", 2: "roses", 3: "trees", 4: "stage", 5: "speech", 6: "support", 7: "cabins", 8: "C", 9: "A", 10: "B",
          11: "G", 12: "D", 13: "A", 14: "E", 15: "F", 16: "B", 17: "B", 18: "D", 19: "A", 20: "D",
          21: "A", 22: "C", 23: "A", 24: "B", 25: "B", 26: "F", 27: "E", 28: "C", 29: "B", 30: "G",
          31: "spring", 32: "tools", 33: "maps", 34: "heavy", 35: "marble", 36: "light", 37: "camera(s)", 38: "medical", 39: "eyes", 40: "wine"
        }
      }
    }
  ]
});
