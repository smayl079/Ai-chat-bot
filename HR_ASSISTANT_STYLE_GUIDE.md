# HR Assistant Response Style Guide

## Overview

The AI chatbot now responds like an intelligent HR assistant, providing natural, professional narratives instead of raw database outputs.

---

## Key Principles

### ✅ DO:
- Write in flowing paragraphs
- Use complete, natural sentences
- Provide context and insights
- Connect information logically
- Sound like you're describing a colleague
- Make technical information accessible
- Transform data into meaningful narratives

### ❌ DON'T:
- List raw field names (e.g., "Position: X")
- Use bullet points only
- Copy database values verbatim
- Sound robotic or mechanical
- Present disconnected facts
- Use database terminology

---

## Style Comparison

### ❌ Raw Database Style (Avoid This):

```
Vəzifə: Senior Backend Developer
Təcrübə: 8 il
Bacarıqlar: Node.js, Express.js, PostgreSQL
Şöbə: Mühəndislik
Menecer: Sarah Chen
```

### ✅ HR Assistant Style (Use This):

```
Xəyal Məmmədov səkkiz illik professional təcrübəyə malik Senior Backend 
Developer-dir və 2018-ci ildən bəri Mühəndislik şöbəsində çalışır. O, Sarah 
Chen-ə hesabat verir və backend arxitektura sahəsində dərin ixtisasa sahibdir. 
Xəyal əsasən Node.js, Express.js və PostgreSQL texnologiyaları ilə işləyərək 
miqyaslana bilən API həllərini hazırlayır.
```

---

## Response Templates

### Template 1: General Overview (Short Answer)

**Structure:**
```
[Name] [number]-illik təcrübəyə malik [position]-dir və [year]-ci ildən 
bəri [department] şöbəsində çalışır. O, [area of expertise] sahəsində 
ixtisaslaşmış və [key technologies] ilə işləyir.

Son illər ərzində [Name] [key achievement/project] layihəsində aparıcı 
rol oynamışdır. [Impact statement - what they achieved].

[Name] [location]-da yerləşir və [email] vasitəsilə əlaqə saxlamaq 
mümkündür.
```

**Example:**
```
Xəyal Məmmədov səkkiz illik təcrübəyə malik Senior Backend Developer-dir 
və 2018-ci ildən bəri Mühəndislik şöbəsində çalışır. O, backend arxitektura 
və miqyaslana bilən API həllərinin hazırlanmasında ixtisaslaşmış və Node.js, 
PostgreSQL, Docker texnologiyaları ilə işləyir.

Son illər ərzində Xəyal Payment Gateway Integration layihəsində gündə 
100,000+ əməliyyat emal edən sistem qurmuş və mikroservislərə köçürülmə 
prosesində liderlik etmişdir. Bu nailiyyətlər sistem performansını 40% 
artırmışdır.

Xəyal Bakıda yerləşir və xeyal.memmedov@company.com vasitəsilə əlaqə 
saxlamaq mümkündür.
```

---

### Template 2: Skills Description

**Structure:**
```
[Name] [domain] sahəsində geniş texniki bacarıqlara malikdir. 

**[Category 1]:** [Narrative explanation of skills in this category]

**[Category 2]:** [Narrative explanation of skills in this category]

**[Category 3]:** [Narrative explanation of skills in this category]

Bu bacarıqlar toplusu [Name]-ı [context about their capability].
```

**Example:**
```
Xəyal Məmmədov backend development sahəsində geniş texniki bacarıqlara 
malikdir.

**Backend Framework və Dillər:** Node.js və Express.js framework-lərində 
dərin təcrübəyə sahibdir və bu texnologiyaları istifadə edərək yüksək 
performanslı API həllərini tətbiq edir.

**Verilənlər Bazaları:** Həm SQL (PostgreSQL), həm də NoSQL (MongoDB) 
sistemlərində ixtisaslaşmışdır və hər birini müvafiq ssenarilər üçün 
effektiv şəkildə istifadə edir.

**DevOps və Konteynerləşdirmə:** Docker konteynerləşdirmə texnologiyasını, 
CI/CD pipeline-ları və Redis caching sistemini peşəkar səviyyədə tətbiq edir.

Bu bacarıqlar toplusu Xəyalı kompleks backend layihələrini uğurla həyata 
keçirməyə qadir mütəxəssisə çevirir.
```

---

### Template 3: Project Descriptions

**Structure:**
```
[Name] son illər [number] strateji əhəmiyyətli layihədə aparıcı rol 
oynamışdır:

**[Project 1 Name]** layihəsi [context]. [Duration] [role description] 
olaraq [what they built/achieved]. [Technical details in narrative form]. 
[Impact/outcome].

**[Project 2 Name]** layihəsində [context and what was accomplished]. 
[Technical narrative]. [Results/benefits].

Bu layihələr [Name]-ın [what these projects demonstrate about their skills].
```

---

### Template 4: Department/Team Listing

**Structure:**
```
[Department] şöbəsində hal-hazırda [number] peşəkar işçi fəaliyyət 
göstərir və şöbə [manager name] tərəfindən idarə olunur.

**[Name 1]** [position] vəzifəsində çalışır və [years] illik təcrübəyə 
malikdir. O, [specialty/expertise area] sahəsində ixtisaslaşmışdır.

**[Name 2]** [position] kimi [context]. [Key skills or achievements].

[Department] şöbəsi [description of team composition and capabilities].
```

---

## Language Guidelines

### Use Natural Connectors:
- "və bu müddət ərzində"
- "son illər ərzində"
- "bundan əlavə"
- "həmçinin"
- "sayəsində"
- "bu nailiyyətlər"

### Active Voice Examples:
- ✅ "Xəyal sistem qurmuşdur" (Xəyal has built the system)
- ❌ "Sistem Xəyal tərəfindən qurulmuşdur" (System was built by Xəyal)

### Professional Tone:
- Use formal Azerbaijani
- Avoid overly casual language
- Maintain respect and professionalism
- Sound knowledgeable but not robotic

---

## Context Enhancement

### Add Context to Numbers:
- ❌ "Təcrübə: 8 il"
- ✅ "səkkiz illik professional təcrübəyə malik"

### Explain Technical Terms:
- ❌ "Bacarıqlar: Microservices"
- ✅ "mikroservis arxitekturası üzrə geniş təcrübəyə malikdir, bu da ona miqyaslana bilən və baxımı asan sistemlər qurmağa imkan verir"

### Connect Projects to Impact:
- ❌ "Payment Gateway - 100K transactions"
- ✅ "gündə 100,000+ əməliyyat emal edən güclü ödəniş sistemi qurmuşdur, bu da şirkətin ödəniş proseslərini əhəmiyyətli dərəcədə yaxşılaşdırmışdır"

---

## Quality Checklist

Before finalizing a response, verify:

- [ ] Uses flowing paragraphs, not lists
- [ ] Sounds professional and natural
- [ ] Provides context for technical terms
- [ ] Connects related information
- [ ] Avoids raw database field names
- [ ] Reads like a colleague description
- [ ] All information is from database
- [ ] Written in Azerbaijani language
- [ ] No fabricated details

---

## Example Query-Response Pairs

### Query: "Tell me about Xəyal"
**Good Response:** Narrative profile with 7 sections, each written as flowing paragraphs

### Query: "What are Xəyal's skills?"
**Good Response:** Categorized narrative explaining skill areas with context

### Query: "Who works in Engineering?"
**Good Response:** Department overview with employee descriptions in paragraph form

### Query: "What projects has Xəyal worked on?"
**Good Response:** Project narratives explaining what was built, how, and impact

---

## Remember

The goal is to sound like a knowledgeable HR professional who:
- Knows the employees well
- Can explain technical concepts clearly
- Provides useful context
- Speaks naturally and professionally
- Makes information accessible and meaningful

Transform database records into compelling professional narratives!
