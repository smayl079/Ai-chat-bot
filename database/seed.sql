-- ============================================
-- Multi-Tenant Chatbot Platform - Seed Data
-- ============================================

-- Clear existing data (careful in production!)
TRUNCATE TABLE chatbot_chunks, chatbot_documents, contact_info, services, faq_items, pages, websites CASCADE;

-- Reset sequences
ALTER SEQUENCE websites_id_seq RESTART WITH 1;
ALTER SEQUENCE pages_id_seq RESTART WITH 1;
ALTER SEQUENCE faq_items_id_seq RESTART WITH 1;
ALTER SEQUENCE services_id_seq RESTART WITH 1;
ALTER SEQUENCE contact_info_id_seq RESTART WITH 1;
ALTER SEQUENCE chatbot_documents_id_seq RESTART WITH 1;
ALTER SEQUENCE chatbot_chunks_id_seq RESTART WITH 1;

-- ============================================
-- 1. WEBSITES
-- ============================================

INSERT INTO websites (name, domain, business_type, chatbot_name, system_prompt, language, is_active) VALUES
(
    'SmileCare Dental Clinic',
    'smilecare-dental.com',
    'Healthcare - Dentistry',
    'Dental Assistant',
    'You are a helpful dental clinic assistant for SmileCare Dental Clinic. Answer questions about dental services, appointments, insurance, and general oral health. Be professional, empathetic, and encouraging about dental care. Always recommend booking an appointment for specific medical advice.',
    'en',
    true
),
(
    'TechForge Solutions',
    'techforge-solutions.io',
    'Software Development',
    'TechBot',
    'You are an AI assistant for TechForge Solutions, a software development agency. Help visitors understand our services, technologies, pricing, and process. Be technical but accessible. Emphasize our expertise in web development, mobile apps, and cloud solutions.',
    'en',
    true
),
(
    'LearnHub Academy',
    'learnhub-academy.edu',
    'Online Education',
    'Learning Assistant',
    'You are a friendly learning assistant for LearnHub Academy, an online course platform. Help students find courses, understand pricing, and answer questions about course content, certificates, and learning paths. Be encouraging and supportive.',
    'en',
    true
);

-- ============================================
-- 2. PAGES - SmileCare Dental Clinic
-- ============================================

INSERT INTO pages (website_id, title, slug, content, meta_description) VALUES
(1, 'Welcome to SmileCare Dental Clinic', 'home', 
'Welcome to SmileCare Dental Clinic - Your Trusted Partner in Oral Health

At SmileCare Dental Clinic, we believe everyone deserves a healthy, beautiful smile. Our state-of-the-art facility in downtown Seattle offers comprehensive dental care for the entire family.

Why Choose SmileCare?
- Experienced team with over 20 years of combined dental expertise
- Latest dental technology including digital X-rays and laser dentistry
- Comfortable, anxiety-free environment designed for patient comfort
- Flexible scheduling including evening and weekend appointments
- Most insurance plans accepted
- Emergency dental services available

Our clinic has been serving the Seattle community since 2015, building lasting relationships with our patients through quality care and genuine concern for their wellbeing.

Visit us today and experience the difference that personalized dental care can make!',
'Premier dental clinic in Seattle offering comprehensive family dentistry, cosmetic procedures, and emergency care.'),

(1, 'Our Services', 'services',
'Comprehensive Dental Services at SmileCare

General Dentistry:
We provide complete preventive and restorative dental care including regular checkups, cleanings, fillings, and root canals. Our preventive approach helps you maintain optimal oral health and catch problems early.

Cosmetic Dentistry:
Transform your smile with our cosmetic services including teeth whitening, veneers, and smile makeovers. Dr. Sarah Johnson specializes in creating natural-looking results that boost your confidence.

Orthodontics:
Straighten your teeth with traditional braces or modern clear aligners. We offer Invisalign treatment for adults and teens who want a discreet orthodontic solution.

Pediatric Dentistry:
We love working with children! Our gentle approach and kid-friendly environment make dental visits fun and stress-free for young patients.

Emergency Dental Care:
Dental emergencies don''t wait for business hours. We offer same-day emergency appointments for toothaches, broken teeth, and other urgent dental problems.

Advanced Procedures:
Our clinic provides dental implants, wisdom teeth extraction, and periodontal treatment using the latest techniques and technology.',
'Full range of dental services including preventive care, cosmetic dentistry, orthodontics, and emergency treatment.'),

(1, 'Meet Our Team', 'team',
'Our Experienced Dental Team

Dr. Sarah Johnson, DDS - Lead Dentist
Dr. Johnson graduated from the University of Washington School of Dentistry with honors. She has over 15 years of experience in general and cosmetic dentistry. Her warm, patient-centered approach puts even the most anxious patients at ease.

Dr. Michael Chen, DDS - Associate Dentist
Specializing in orthodontics and pediatric dentistry, Dr. Chen joined SmileCare in 2018. He completed his residency at Children''s Hospital and brings a special talent for working with young patients.

Linda Martinez, RDH - Dental Hygienist
With 12 years of experience, Linda is passionate about patient education and preventive care. Patients appreciate her gentle cleaning technique and helpful oral health tips.

Jennifer Thomas - Office Manager
Jennifer ensures your visit runs smoothly from scheduling to insurance processing. She''s been with SmileCare since we opened and knows our patients by name.

The entire SmileCare team participates in continuing education to stay current with the latest dental techniques and technologies.',
'Meet the experienced and caring dental professionals at SmileCare Dental Clinic.'),

(1, 'Insurance & Payment', 'insurance',
'Insurance and Payment Options

Accepted Insurance Plans:
We work with most major dental insurance providers including:
- Delta Dental
- Cigna
- Aetna
- MetLife
- United Healthcare
- Guardian
- Blue Cross Blue Shield

Not sure if we accept your plan? Call us at (206) 555-0123 and our office staff will verify your benefits.

Payment Options:
- Cash, check, or credit card
- CareCredit healthcare financing
- Flexible payment plans for larger treatments
- HSA and FSA accounts accepted

No Insurance? No Problem!
We offer a SmileCare Membership Plan for patients without insurance:
- Two cleanings per year
- Annual comprehensive exam
- Emergency visits
- 20% discount on all treatments
- Only $299 per year for adults, $199 for children

Our financial coordinator will work with you to find a payment solution that fits your budget. Quality dental care should be accessible to everyone.',
'Information about dental insurance plans accepted, payment options, and financing at SmileCare.'),

(1, 'Patient Resources', 'resources',
'Patient Resources and Information

Before Your First Visit:
- Download and complete our patient information form
- Bring your insurance card and photo ID
- Arrive 10 minutes early for paperwork
- List all medications you''re currently taking

What to Expect:
Your first visit includes a comprehensive oral examination, digital X-rays if needed, and a professional cleaning. We''ll discuss any issues we find and create a personalized treatment plan.

Dental Health Tips:
- Brush twice daily for two minutes
- Floss at least once per day
- Replace your toothbrush every 3 months
- Limit sugary foods and drinks
- Visit your dentist every 6 months

Emergency Care:
For dental emergencies, call us immediately at (206) 555-0123. We reserve time slots each day for urgent cases.

Common emergencies we treat:
- Severe toothache
- Knocked-out tooth
- Broken or cracked tooth
- Lost filling or crown
- Abscess or infection

Post-Treatment Care:
After procedures, follow our care instructions carefully. If you have questions or concerns, don''t hesitate to call us.

Appointment Cancellation:
We require 24-hour notice for cancellations. This allows us to offer the time to patients on our waiting list.',
'Helpful resources for SmileCare dental patients including first visit info and dental health tips.');

-- ============================================
-- 3. PAGES - TechForge Solutions
-- ============================================

INSERT INTO pages (website_id, title, slug, content, meta_description) VALUES
(2, 'TechForge Solutions - Custom Software Development', 'home',
'Build Better Software with TechForge Solutions

TechForge Solutions is a full-stack software development agency specializing in web applications, mobile apps, and cloud infrastructure. Since 2016, we''ve helped over 150 companies transform their ideas into powerful digital products.

What We Do:
- Custom Web Application Development
- Native and Cross-Platform Mobile Apps
- Cloud Architecture and DevOps
- API Development and Integration
- UI/UX Design
- Technical Consulting and Code Audits

Our Approach:
We believe in building software that scales. Our agile development process ensures you''re involved at every stage, from initial wireframes to final deployment. We use modern technologies and best practices to deliver maintainable, high-performance applications.

Technologies We Love:
Frontend: React, Vue.js, Next.js, TypeScript
Backend: Node.js, Python, .NET Core, Java
Mobile: React Native, Flutter, Swift, Kotlin
Cloud: AWS, Google Cloud, Azure, Docker, Kubernetes
Databases: PostgreSQL, MongoDB, Redis

Based in San Francisco with a distributed team across North America, we serve clients from startups to Fortune 500 companies.',
'TechForge Solutions - Expert software development agency for web, mobile, and cloud applications.'),

(2, 'Our Services', 'services',
'Software Development Services

Web Application Development:
We build scalable, responsive web applications using modern frameworks like React, Vue.js, and Next.js. Whether you need a customer portal, SaaS platform, or enterprise application, we have the expertise to deliver.

Mobile App Development:
Native iOS and Android apps, or cross-platform solutions using React Native and Flutter. We handle everything from concept to App Store deployment and ongoing maintenance.

Cloud Infrastructure & DevOps:
Optimize your infrastructure with cloud-native architecture. We specialize in AWS, Google Cloud, and Azure, implementing CI/CD pipelines, containerization, and infrastructure as code.

API Development & Integration:
Build robust RESTful and GraphQL APIs, integrate third-party services, and create microservices architectures that enable your applications to communicate seamlessly.

UI/UX Design:
User experience is at the heart of everything we build. Our design team creates intuitive interfaces that users love, backed by user research and usability testing.

Technical Consulting:
Need expert guidance? We offer code reviews, architecture assessments, technology stack recommendations, and strategic technical planning.

Staff Augmentation:
Extend your team with our experienced developers. We integrate seamlessly with your existing workflows and development practices.',
'Comprehensive software development services including web, mobile, cloud, and consulting.'),

(2, 'Our Process', 'process',
'How We Work - Agile Development Process

Discovery & Planning (Week 1-2):
We start every project with a deep dive into your business goals, target users, and technical requirements. We''ll map user journeys, define feature priorities, and create a detailed project roadmap.

Deliverables: Project brief, user stories, technical specifications, timeline estimate

Design Phase (Week 2-4):
Our design team creates wireframes and high-fidelity mockups. You''ll see exactly how your application will look and flow before we write a single line of code.

Deliverables: Wireframes, UI designs, interactive prototype, design system

Development Sprints (Ongoing):
We work in 2-week sprints, delivering working features regularly. You''ll have access to a staging environment to test progress and provide feedback.

Deliverables: Working software, sprint demos, progress reports

Testing & Quality Assurance:
Comprehensive testing happens throughout development. We perform unit testing, integration testing, and end-to-end testing to ensure reliability.

Deliverables: Test reports, bug fixes, performance optimization

Deployment & Launch:
We handle the entire deployment process including infrastructure setup, database migration, and monitoring configuration. We''re there on launch day to ensure everything goes smoothly.

Deliverables: Production deployment, documentation, monitoring setup

Post-Launch Support:
Our relationship doesn''t end at launch. We offer ongoing maintenance, feature additions, and technical support to help your product grow.

Communication:
- Daily Slack communication
- Weekly progress meetings
- Bi-weekly sprint reviews
- Project management via Jira
- Shared GitHub repository',
'Our agile software development process from discovery to deployment and beyond.'),

(2, 'Case Studies', 'case-studies',
'Client Success Stories

HealthTrack: Telemedicine Platform
Challenge: A healthcare startup needed a HIPAA-compliant telemedicine platform supporting video consultations, appointment scheduling, and electronic health records.

Solution: We built a React-based web application with Node.js backend, integrated Twilio for video calls, and implemented end-to-end encryption for patient data.

Results:
- Platform launched in 6 months
- 10,000+ consultations in first year
- 99.9% uptime
- Successfully passed security audit

RetailSync: Inventory Management System
Challenge: A growing retail chain needed to modernize their legacy inventory system and sync data across 50+ locations in real-time.

Solution: Cloud-native architecture on AWS with React Native mobile app for store managers, real-time sync using WebSockets, and comprehensive analytics dashboard.

Results:
- 60% reduction in inventory discrepancies
- Real-time visibility across all locations
- Mobile app rated 4.8 stars by employees
- ROI achieved in 8 months

LearnFlow: Educational Platform
Challenge: EdTech company wanted to create an interactive learning platform with video courses, quizzes, and progress tracking for 100,000+ students.

Solution: Scalable microservices architecture with Next.js frontend, video streaming via AWS CloudFront, and PostgreSQL for data management.

Results:
- Handles 50,000 concurrent users
- 99.95% uptime
- Average page load time under 2 seconds
- Student satisfaction score: 9.2/10

Our clients range from venture-backed startups to established enterprises. Each project receives the same level of dedication and technical excellence.',
'Real-world case studies showing successful software projects delivered by TechForge Solutions.'),

(2, 'Careers', 'careers',
'Join the TechForge Team

We''re always looking for talented developers, designers, and problem solvers to join our growing team.

Why Work at TechForge?

Remote-First Culture:
Work from anywhere in North America. We believe great work happens when people have the flexibility to work where they''re most productive.

Competitive Compensation:
Salaries above industry average, plus equity options for senior roles. Annual bonus based on company and individual performance.

Professional Development:
- $2,000 annual learning budget for courses and conferences
- Regular lunch-and-learn sessions
- Mentorship program
- Time for open-source contributions

Benefits:
- Comprehensive health, dental, and vision insurance
- 401(k) with company match
- Unlimited PTO policy
- Latest MacBook Pro or equivalent
- Home office stipend

Current Openings:
- Senior Full-Stack Developer (React/Node.js)
- Mobile Developer (React Native)
- DevOps Engineer (AWS/Kubernetes)
- UI/UX Designer
- Technical Project Manager

What We Look For:
- Strong technical skills and clean code practices
- Self-motivated and excellent communicator
- Experience working remotely
- Passion for learning new technologies
- Collaborative team player

Not seeing your role? Send us your resume anyway. We''re always open to exceptional talent.

Apply: careers@techforge-solutions.io',
'Career opportunities at TechForge Solutions - join our remote-first software development team.');

-- ============================================
-- 4. PAGES - LearnHub Academy
-- ============================================

INSERT INTO pages (website_id, title, slug, content, meta_description) VALUES
(3, 'LearnHub Academy - Online Courses for Everyone', 'home',
'Unlock Your Potential with LearnHub Academy

LearnHub Academy is a leading online learning platform offering over 500 courses in technology, business, design, and personal development. Since 2017, we''ve helped more than 200,000 students worldwide advance their careers and learn new skills.

Why Choose LearnHub?

Expert Instructors:
Learn from industry professionals with real-world experience. Our instructors include Google engineers, bestselling authors, successful entrepreneurs, and recognized experts in their fields.

Learn at Your Own Pace:
All courses are self-paced with lifetime access. Watch video lessons on any device, complete hands-on projects, and revisit material whenever you need a refresher.

Career-Focused Content:
Our courses are designed to teach practical, in-demand skills. Many students report promotions, career changes, or new opportunities after completing our programs.

Certificates of Completion:
Earn verifiable certificates to showcase on LinkedIn and your resume. Some courses offer preparation for industry certifications.

Supportive Community:
Join discussion forums, study groups, and live Q&A sessions. Connect with fellow learners from around the world.

Popular Course Categories:
- Web Development & Programming
- Data Science & Machine Learning
- Digital Marketing
- Business & Entrepreneurship
- Design & Creativity
- Personal Development

Start learning today with our 7-day free trial. No credit card required.',
'LearnHub Academy - Learn in-demand skills with 500+ online courses in tech, business, and design.'),

(3, 'Course Catalog', 'courses',
'Explore Our Course Catalog

Web Development & Programming:
- Complete Web Development Bootcamp (60 hours)
- Python for Beginners to Advanced (45 hours)
- React.js Masterclass (35 hours)
- Full-Stack JavaScript (50 hours)
- Mobile App Development with React Native (40 hours)

Data Science & Analytics:
- Data Science with Python (55 hours)
- Machine Learning A-Z (65 hours)
- SQL for Data Analysis (25 hours)
- Business Intelligence with Tableau (30 hours)
- Deep Learning Specialization (70 hours)

Digital Marketing:
- Complete Digital Marketing Course (40 hours)
- SEO Mastery (25 hours)
- Social Media Marketing Strategy (20 hours)
- Google Ads Certification Prep (22 hours)
- Email Marketing Excellence (18 hours)

Business & Entrepreneurship:
- Start Your Business: From Idea to Launch (35 hours)
- Financial Management for Non-Finance Professionals (28 hours)
- Project Management Professional (PMP) Prep (55 hours)
- Leadership and Management Essentials (30 hours)
- Excel for Business (25 hours)

Design:
- UI/UX Design Complete Course (45 hours)
- Adobe Photoshop Mastery (30 hours)
- Graphic Design Fundamentals (35 hours)
- Video Editing with Premiere Pro (28 hours)
- 3D Design with Blender (40 hours)

Personal Development:
- Public Speaking Confidence (15 hours)
- Time Management Mastery (12 hours)
- Mindfulness and Productivity (10 hours)
- Career Development Strategies (20 hours)

All courses include:
- HD video lessons
- Downloadable resources
- Hands-on projects
- Quizzes and assessments
- Certificate of completion
- Lifetime access
- 30-day money-back guarantee',
'Browse 500+ online courses across web development, data science, marketing, business, and more.'),

(3, 'Pricing & Plans', 'pricing',
'LearnHub Pricing Plans

Individual Course Purchase:
Buy courses individually starting at $19.99-$199.99 depending on course length and complexity. All individual purchases include lifetime access.

Monthly Subscription: $29/month
- Access to 500+ courses
- New courses added monthly
- Download lessons for offline viewing
- Course completion certificates
- Cancel anytime
- First 7 days free

Annual Subscription: $199/year
- Everything in Monthly plan
- Save over 40% compared to monthly
- Priority support
- Early access to new courses
- Exclusive member webinars
- Best value for serious learners

Team Plans: Starting at $299/year per member
- Perfect for companies investing in employee training
- Admin dashboard to track team progress
- Custom learning paths
- Bulk license discounts available
- Dedicated account manager
- Invoicing and purchase orders accepted

Student Discount:
Valid .edu email? Get 50% off annual subscription. Verify your student status to unlock this special pricing.

Enterprise Solutions:
For organizations with 20+ learners, we offer custom enterprise plans with:
- White-label platform options
- Custom course creation
- Advanced analytics and reporting
- SSO integration
- Dedicated support

Payment Methods:
We accept all major credit cards, PayPal, and company purchase orders for team and enterprise plans.

Money-Back Guarantee:
Not satisfied? Get a full refund within 30 days of purchase, no questions asked.',
'Flexible pricing plans for individuals, teams, and enterprises. Start learning for just $29/month.'),

(3, 'How It Works', 'how-it-works',
'How LearnHub Academy Works

Step 1: Browse & Choose
Explore our course catalog by category, skill level, or search for specific topics. Read course descriptions, watch preview videos, and check student reviews to find the perfect course.

Step 2: Enroll
Choose between individual course purchase or unlimited subscription. Sign up takes less than 2 minutes. Start your 7-day free trial if choosing subscription.

Step 3: Learn at Your Pace
Access your course dashboard to start learning. Watch video lessons on any device - desktop, tablet, or mobile. Download the LearnHub app for offline learning.

Course Structure:
- Courses are divided into sections and lessons
- Each lesson is 5-15 minutes for easy learning
- Progress tracking shows what you''ve completed
- Bookmarks let you save important moments

Step 4: Practice & Apply
Complete hands-on projects and coding exercises. Get immediate feedback on quizzes. Download supplementary materials and resources.

Step 5: Get Support
Stuck on something? Ask questions in course discussion forums. Instructors and teaching assistants respond within 24 hours. Study with peers in our community.

Step 6: Earn Your Certificate
Complete all lessons and pass the final assessment to earn your certificate. Share it on LinkedIn, add it to your resume, or download a PDF.

Learning Features:
- Adjustable playback speed (0.5x to 2x)
- Closed captions in multiple languages
- Take notes while watching
- Code along with in-browser IDE
- Track your learning streak

Mobile Apps:
Download our iOS and Android apps to learn on the go. Sync your progress across all devices automatically.

Time Commitment:
Most students spend 3-7 hours per week on courses. With self-paced learning, you set your own schedule.',
'Learn how LearnHub Academy works - from enrollment to certification in 6 easy steps.'),

(3, 'Success Stories', 'testimonials',
'Student Success Stories

"From Accountant to Software Developer"
Sarah M., Complete Web Development Bootcamp

"At 35, I decided to change careers from accounting to web development. LearnHub''s bootcamp gave me all the skills I needed. Six months after completing the course, I landed a junior developer position. One year later, I''m now a mid-level developer earning $85k. Best investment I ever made."

"Promoted Within 3 Months"
James L., Data Science with Python

"I took the Data Science course to add new skills to my business analyst role. Within weeks, I was applying machine learning to real projects at work. My manager noticed immediately. Three months later, I was promoted to Senior Data Analyst with a 30% raise. The course paid for itself many times over."

"Started My Own Agency"
Maria G., Complete Digital Marketing Course

"I used to work for a marketing agency but dreamed of having my own. LearnHub''s marketing course taught me everything from SEO to social media ads. I started freelancing on the side, and within a year, I had enough clients to go full-time. My agency now has 3 employees and we''re growing fast."

"Learning Made Fun Again"
David K., Multiple Courses

"At 62, I was nervous about learning new technology. The instructors at LearnHub make complex topics easy to understand. I''ve completed 8 courses so far, including Python programming and video editing. Age is just a number - you''re never too old to learn."

"Landed My Dream Job"
Emily R., UI/UX Design Complete Course

"After years in retail, I wanted a creative career. The UI/UX course taught me user research, wireframing, prototyping, and design tools. I built a portfolio of projects from the course. Applied to 20 jobs and got 5 interviews. Now I''m a UX designer at a startup I love."

Career Outcomes:
- 87% of students report career benefits
- Average salary increase of $15,000
- 45% career changers
- 92% would recommend LearnHub

Start your success story today.',
'Read inspiring stories from LearnHub students who achieved career growth and personal goals.');

-- ============================================
-- 5. FAQ ITEMS - SmileCare Dental
-- ============================================

INSERT INTO faq_items (website_id, question, answer, category) VALUES
(1, 'How often should I visit the dentist?', 'We recommend visiting the dentist every 6 months for a routine checkup and professional cleaning. However, if you have specific dental issues or gum disease, more frequent visits may be necessary. Regular visits help us catch problems early when they''re easier and less expensive to treat.', 'General'),
(1, 'Do you accept my dental insurance?', 'We work with most major dental insurance providers including Delta Dental, Cigna, Aetna, MetLife, United Healthcare, Guardian, and Blue Cross Blue Shield. Call our office at (206) 555-0123 with your insurance information, and we''ll verify your coverage before your appointment.', 'Insurance'),
(1, 'What should I do if I have a dental emergency?', 'Call us immediately at (206) 555-0123. We reserve time slots each day for emergency cases. For after-hours emergencies, call the same number and follow the prompts for our emergency line. Common emergencies include severe toothache, knocked-out teeth, broken teeth, and dental abscesses.', 'Emergency Care'),
(1, 'Is teeth whitening safe?', 'Yes, professional teeth whitening is safe when performed under dental supervision. We use professional-grade whitening agents that are more effective and safer than over-the-counter products. Some patients experience temporary sensitivity, but this usually resolves within a few days. We''ll evaluate your teeth to ensure you''re a good candidate for whitening.', 'Cosmetic'),
(1, 'How much does a dental cleaning cost?', 'The cost of a routine dental cleaning typically ranges from $75-$200 depending on your specific needs. If you have dental insurance, most plans cover preventive cleanings at 100%. For patients without insurance, ask about our SmileCare Membership Plan which includes two cleanings per year for just $299.', 'Pricing'),
(1, 'Are dental X-rays necessary?', 'Dental X-rays are an essential diagnostic tool that helps us see problems not visible during a regular exam, such as cavities between teeth, bone loss, and impacted teeth. We use digital X-rays which emit up to 90% less radiation than traditional film X-rays. The frequency of X-rays depends on your oral health status, typically once a year for adults.', 'General'),
(1, 'Can you help with dental anxiety?', 'Absolutely! We understand many people feel anxious about dental visits. Our clinic offers several options including nitrous oxide (laughing gas), oral sedation, and a calm, comfortable environment. Let us know about your concerns when you book your appointment, and we''ll make sure you feel relaxed and at ease throughout your visit.', 'Patient Care'),
(1, 'Do you offer payment plans?', 'Yes, we offer flexible payment plans for larger treatments. We also work with CareCredit, a healthcare financing company that offers promotional financing options. Our financial coordinator will work with you to create a payment plan that fits your budget. Don''t let cost prevent you from getting the dental care you need.', 'Financing');

-- ============================================
-- 6. FAQ ITEMS - TechForge Solutions
-- ============================================

INSERT INTO faq_items (website_id, question, answer, category) VALUES
(2, 'What is your typical project timeline?', 'Project timelines vary based on complexity and scope. A simple website or mobile app might take 2-3 months, while a complex web application could take 6-12 months. During our discovery phase, we''ll provide a detailed timeline with milestones. We work in agile sprints, delivering working features every two weeks, so you see progress throughout the project.', 'Process'),
(2, 'How much does custom software development cost?', 'Project costs range from $50,000 for a simple application to $500,000+ for enterprise systems. Factors affecting cost include complexity, features, design requirements, and integrations. We offer transparent pricing with detailed estimates after our discovery phase. We can also work iteratively, building an MVP first and adding features in phases to spread costs over time.', 'Pricing'),
(2, 'Do you provide ongoing support after launch?', 'Yes! We offer post-launch support packages including bug fixes, performance monitoring, security updates, and feature enhancements. Our standard support package starts at $5,000/month. We also offer staff augmentation where our developers integrate with your team on an ongoing basis.', 'Support'),
(2, 'What technologies do you specialize in?', 'Our core expertise includes React, Vue.js, Next.js, and TypeScript for frontend; Node.js, Python, .NET Core for backend; React Native and Flutter for mobile; and AWS, Google Cloud, and Azure for cloud infrastructure. We also work with PostgreSQL, MongoDB, Redis, Docker, and Kubernetes. We choose technologies based on your project requirements, not trends.', 'Technical'),
(2, 'Can you integrate with our existing systems?', 'Absolutely. We have extensive experience integrating with legacy systems, third-party APIs, and SaaS platforms. Whether you need to connect to Salesforce, payment gateways, shipping providers, or custom internal systems, we''ll create seamless integrations. We can also help modernize legacy applications gradually without disrupting your operations.', 'Technical'),
(2, 'Do you sign NDAs?', 'Yes, we''re happy to sign non-disclosure agreements before discussing your project. We take intellectual property seriously and include IP assignment clauses in our contracts ensuring you own all code and designs we create for you. Many of our clients are venture-backed startups or enterprises with sensitive information.', 'Legal'),
(2, 'Can you help me define my project requirements?', 'Definitely! Many clients come to us with a concept but need help defining technical requirements. Our discovery phase includes stakeholder interviews, user research, competitive analysis, and technical planning. We''ll help you prioritize features, plan your MVP, and create a roadmap for future growth. Think of us as your technical co-founder.', 'Process'),
(2, 'How do you handle communication and project management?', 'We use agile project management with tools like Jira and GitHub. You''ll have daily communication via Slack, weekly progress meetings, and bi-weekly sprint reviews. We assign a dedicated project manager to your account who keeps everything on track. You''ll have full transparency with access to our project management system and code repository.', 'Process');

-- ============================================
-- 7. FAQ ITEMS - LearnHub Academy
-- ============================================

INSERT INTO faq_items (website_id, question, answer, category) VALUES
(3, 'How does the subscription work?', 'Our subscription gives you unlimited access to all 500+ courses for a flat monthly or annual fee. Watch as many courses as you want, switch between courses anytime, and keep access as long as your subscription is active. The monthly plan is $29/month and the annual plan is $199/year. Both include a 7-day free trial with no credit card required.', 'Pricing'),
(3, 'Can I download courses for offline viewing?', 'Yes! Subscription members can download course videos to watch offline using our mobile apps for iOS and Android. This is perfect for learning during commutes or when traveling. Individual course purchases also include download access. Note that you''ll need to reconnect to the internet periodically to verify your subscription status.', 'Access'),
(3, 'Are the certificates recognized by employers?', 'Our certificates of completion demonstrate that you''ve invested time learning valuable skills. While they''re not accredited like university degrees, many employers value them as proof of initiative and knowledge. Students regularly add LearnHub certificates to their LinkedIn profiles and resumes. Some courses also prepare you for industry certifications from organizations like Google, AWS, and PMI.', 'Certificates'),
(3, 'What if I don''t like a course?', 'We offer a 30-day money-back guarantee, no questions asked. If you purchase a course or subscription and aren''t satisfied, simply request a refund within 30 days. We want you to be confident in your purchase. You can also watch course preview videos and read student reviews before enrolling.', 'Refunds'),
(3, 'Do I need any prior experience?', 'It depends on the course! We offer courses for all skill levels from complete beginner to advanced. Each course listing clearly states the prerequisites and target audience. Many of our most popular courses like "Python for Beginners" and "Complete Web Development Bootcamp" are designed for people with zero prior experience.', 'General'),
(3, 'How long do I have access to purchased courses?', 'Individual course purchases include lifetime access. Once you buy a course, it''s yours forever. You can revisit the material anytime, even if the price increases later. For subscriptions, you have access to all courses as long as your subscription is active. When you cancel, you lose access, but your progress is saved if you resubscribe later.', 'Access'),
(3, 'Can I get a refund if I don''t complete a course?', 'Yes, our 30-day money-back guarantee applies regardless of how much of the course you''ve completed. We want you to be happy with your purchase. However, we encourage you to give courses a fair try - many students feel overwhelmed initially but find their stride after a few lessons.', 'Refunds'),
(3, 'Do you offer team or corporate plans?', 'Yes! Our team plans start at $299/year per member and include an admin dashboard to track team progress, custom learning paths, and priority support. For organizations with 20+ learners, we offer enterprise solutions with white-label options, custom courses, advanced analytics, and SSO integration. Contact our sales team for a customized quote.', 'Business');

-- ============================================
-- 8. SERVICES - SmileCare Dental
-- ============================================

INSERT INTO services (website_id, name, short_description, full_description, price, currency, is_active) VALUES
(1, 'Dental Checkup & Cleaning', 'Comprehensive exam and professional cleaning', 'Our dental checkup includes a thorough examination of your teeth, gums, and oral tissues. We check for cavities, gum disease, oral cancer, and other dental problems. The professional cleaning removes plaque and tartar buildup that regular brushing can''t reach. We''ll also take digital X-rays if needed and provide personalized oral health advice. Recommended every 6 months for optimal oral health.', 150.00, 'USD', true),
(1, 'Teeth Whitening', 'Professional teeth whitening treatment', 'Transform your smile with our professional teeth whitening service. We use a powerful yet safe whitening gel activated by LED light to remove years of stains from coffee, tea, wine, and aging. Results are visible immediately with teeth 3-8 shades whiter. The procedure takes about 90 minutes and includes a take-home touch-up kit. Safe for enamel and long-lasting results with proper care.', 499.00, 'USD', true),
(1, 'Dental Crowns', 'Restore damaged teeth with custom crowns', 'Dental crowns are custom-made caps that cover damaged or weakened teeth, restoring their shape, size, and strength. We use high-quality porcelain or ceramic materials that match your natural teeth perfectly. Crowns are ideal for teeth with large fillings, after root canals, or for badly cracked teeth. The procedure typically requires two visits. Crowns are durable, long-lasting, and look completely natural.', 1200.00, 'USD', true),
(1, 'Invisalign Clear Aligners', 'Straighten teeth with invisible aligners', 'Invisalign offers a modern alternative to traditional braces using virtually invisible, removable aligners. Custom-made for your teeth, these clear plastic trays gradually shift your teeth into the desired position. Benefits include: no metal brackets, removable for eating and cleaning, fewer office visits, and typically faster treatment than braces. Treatment time averages 12-18 months. Initial consultation includes 3D imaging and treatment plan.', 4500.00, 'USD', true),
(1, 'Root Canal Therapy', 'Save infected teeth with gentle root canal treatment', 'Root canal therapy saves teeth that would otherwise need extraction. When tooth pulp becomes infected or inflamed due to deep decay, cracks, or trauma, a root canal removes the infected tissue, cleans and disinfects the tooth interior, and seals it to prevent reinfection. We use modern techniques and anesthesia to ensure comfort throughout the procedure. Most root canals are no more uncomfortable than getting a filling.', 950.00, 'USD', true),
(1, 'Dental Implants', 'Permanent tooth replacement solution', 'Dental implants are the gold standard for replacing missing teeth. A titanium post is surgically placed in your jawbone, where it fuses naturally with the bone. A custom crown is then attached, creating a permanent tooth that looks, feels, and functions like your natural teeth. Implants prevent bone loss, don''t affect adjacent teeth, and can last a lifetime with proper care. The process takes several months but results are worth the wait.', 3500.00, 'USD', true);

-- ============================================
-- 9. SERVICES - TechForge Solutions
-- ============================================

INSERT INTO services (website_id, name, short_description, full_description, price, currency, is_active) VALUES
(2, 'Custom Web Application Development', 'Build scalable web applications with modern frameworks', 'We develop custom web applications tailored to your business needs using React, Vue.js, Next.js, and other modern frameworks. Our solutions are responsive, performant, and scalable. Services include frontend and backend development, database design, API integration, authentication systems, and admin dashboards. We follow best practices for security, testing, and code quality. Perfect for SaaS platforms, customer portals, internal tools, and enterprise applications. Timeline: 3-6 months. Includes discovery, design, development, testing, and deployment.', 75000.00, 'USD', true),
(2, 'Mobile App Development', 'Native and cross-platform mobile applications', 'Full-service mobile app development for iOS and Android. We build native apps using Swift and Kotlin, or cross-platform apps using React Native and Flutter. Our process includes UX design, development, backend API creation, App Store submission, and post-launch support. Features can include user authentication, push notifications, in-app purchases, social integration, and offline functionality. Ideal for startups, businesses expanding to mobile, and companies modernizing legacy apps. Timeline: 3-5 months for MVP.', 65000.00, 'USD', true),
(2, 'Cloud Infrastructure & DevOps', 'Scalable cloud architecture and automated deployments', 'Optimize your infrastructure with cloud-native solutions on AWS, Google Cloud, or Azure. Services include architecture design, infrastructure as code (Terraform/CloudFormation), CI/CD pipeline setup, containerization with Docker and Kubernetes, monitoring and logging, auto-scaling configuration, and security hardening. We help you reduce costs, improve reliability, and enable faster deployments. Perfect for companies experiencing growth, modernizing legacy systems, or launching new products. Pricing varies by complexity.', 35000.00, 'USD', true),
(2, 'API Development & Integration', 'RESTful and GraphQL API design and integration', 'Design and build robust APIs that power your applications and enable third-party integrations. We create RESTful and GraphQL APIs with proper authentication, rate limiting, documentation, and versioning. Services also include integrating your systems with third-party APIs like payment processors (Stripe, PayPal), CRMs (Salesforce, HubSpot), shipping providers, and more. Includes API testing, monitoring, and comprehensive documentation. Timeline: 6-12 weeks depending on complexity.', 25000.00, 'USD', true),
(2, 'UI/UX Design Services', 'User-centered design for web and mobile', 'Create intuitive, beautiful interfaces that users love. Our design process includes user research, persona development, information architecture, wireframing, high-fidelity mockups, interactive prototypes, and design system creation. We conduct usability testing to validate designs before development begins. Deliverables include design files (Figma/Sketch), style guides, and component libraries. We can handle designs for web applications, mobile apps, marketing sites, and dashboards. Timeline: 4-8 weeks.', 20000.00, 'USD', true),
(2, 'Technical Consulting', 'Expert guidance for your technology decisions', 'Get strategic technical advice from experienced engineers and architects. Services include code audits, architecture reviews, technology stack recommendations, scalability assessments, security reviews, technical due diligence for acquisitions, and CTO advisory. We help you make informed decisions about technology investments, identify technical debt, and plan roadmaps. Ideal for startups, non-technical founders, and companies facing technical challenges. Available as project-based or monthly retainer. Hourly rate: $200-$300.', 15000.00, 'USD', true);

-- ============================================
-- 10. SERVICES - LearnHub Academy
-- ============================================

INSERT INTO services (website_id, name, short_description, full_description, price, currency, is_active) VALUES
(3, 'Complete Web Development Bootcamp', 'Become a full-stack web developer in 6 months', 'The ultimate web development course covering HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, and deployment. Build 15+ real-world projects including a portfolio site, e-commerce store, social media app, and REST API. Learn modern development tools like Git, VS Code, and Chrome DevTools. Includes career guidance, portfolio review, and interview preparation. 60 hours of video content, 100+ coding exercises, and lifetime access. No prior experience required. By the end, you''ll be ready for junior developer positions.', 149.99, 'USD', true),
(3, 'Data Science with Python', 'Master data analysis, visualization, and machine learning', 'Comprehensive data science course using Python. Learn NumPy, Pandas, Matplotlib, Seaborn for data analysis and visualization. Build machine learning models with Scikit-learn. Work with real datasets from Kaggle and perform end-to-end projects. Topics include data cleaning, exploratory data analysis, statistical analysis, regression, classification, clustering, and neural networks. Includes Python fundamentals for those new to programming. 55 hours of content with hands-on Jupyter notebook exercises. Perfect for career changers and analysts looking to upskill.', 129.99, 'USD', true),
(3, 'Complete Digital Marketing Course', 'Master SEO, social media, ads, and content marketing', 'Learn all aspects of digital marketing in one comprehensive course. Modules include SEO (on-page, off-page, technical), Google Ads, Facebook/Instagram advertising, social media marketing, email marketing, content marketing, analytics with Google Analytics, and marketing automation. Create real campaigns and build a portfolio of marketing work. Taught by certified marketers with agency experience. 40 hours of video plus templates, checklists, and resource guides. Ideal for entrepreneurs, business owners, career switchers, and marketing professionals.', 99.99, 'USD', true),
(3, 'React.js Masterclass', 'Build modern web apps with React and Redux', 'Deep dive into React.js from fundamentals to advanced patterns. Learn components, props, state, hooks, context API, Redux for state management, React Router, API integration, authentication, testing with Jest, and deployment. Build 8 production-quality projects including a Netflix clone, task management app, and e-commerce frontend. Best practices for component architecture, performance optimization, and code organization. Assumes JavaScript knowledge. 35 hours of content with source code for all projects. Stay current with regular updates as React evolves.', 89.99, 'USD', true),
(3, 'UI/UX Design Complete Course', 'Design beautiful, user-friendly digital products', 'Complete UI/UX design course covering the entire design process. Learn user research methods, persona creation, user journey mapping, information architecture, wireframing, prototyping, visual design principles, color theory, typography, and design systems. Master industry-standard tools: Figma, Adobe XD, and Sketch. Conduct usability testing and iterate on designs. Build a professional portfolio with 6 real projects. No prior design experience needed. 45 hours of video content. Many students transition to design careers after completing this course.', 119.99, 'USD', true),
(3, 'Machine Learning A-Z', 'Complete machine learning and AI course', 'Comprehensive machine learning course covering supervised learning, unsupervised learning, reinforcement learning, and deep learning. Use Python, TensorFlow, and PyTorch to build models for regression, classification, clustering, natural language processing, and computer vision. Learn theory behind algorithms and implement them from scratch. Work on real-world projects including sentiment analysis, image recognition, and recommendation systems. Assumes basic Python knowledge and high school math. 65 hours of content with downloadable code and datasets. Includes career advice for ML engineers.', 139.99, 'USD', true);

-- ============================================
-- 11. CONTACT INFO
-- ============================================

INSERT INTO contact_info (website_id, email, phone, address, working_hours, whatsapp) VALUES
(1, 'info@smilecare-dental.com', '(206) 555-0123', '1234 Dental Avenue, Suite 100, Seattle, WA 98101, USA', 'Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 3:00 PM, Sunday: Closed (Emergency calls answered 24/7)', '(206) 555-0123'),
(2, 'hello@techforge-solutions.io', '(415) 555-0199', '500 Tech Plaza, 12th Floor, San Francisco, CA 94105, USA', 'Monday-Friday: 9:00 AM - 5:00 PM PST (Remote team available globally)', '(415) 555-0199'),
(3, 'support@learnhub-academy.edu', '(888) 555-LEARN', '789 Education Way, Austin, TX 78701, USA', 'Monday-Sunday: 24/7 Support Available (Online Platform)', '(888) 555-5327');

-- ============================================
-- 12. CHATBOT DOCUMENTS - SmileCare Dental
-- ============================================

INSERT INTO chatbot_documents (website_id, source_type, title, raw_content, source_url) VALUES
(1, 'page', 'Welcome to SmileCare', 'Welcome to SmileCare Dental Clinic - Your Trusted Partner in Oral Health. At SmileCare Dental Clinic, we believe everyone deserves a healthy, beautiful smile. Our state-of-the-art facility offers comprehensive dental care for the entire family. We have over 20 years of combined dental expertise and use the latest dental technology including digital X-rays and laser dentistry.', 'https://smilecare-dental.com'),
(1, 'service', 'General Dentistry Services', 'SmileCare provides complete preventive and restorative dental care including regular checkups every 6 months, professional cleanings, fillings, and root canals. Our preventive approach helps patients maintain optimal oral health and catch problems early before they become serious.', 'https://smilecare-dental.com/services'),
(1, 'service', 'Cosmetic Dentistry', 'Transform your smile with cosmetic services including professional teeth whitening for $499, porcelain veneers, and complete smile makeovers. Dr. Sarah Johnson specializes in cosmetic dentistry and creating natural-looking results. Teeth whitening takes 90 minutes and can make teeth 3-8 shades whiter.', 'https://smilecare-dental.com/services'),
(1, 'service', 'Emergency Dental Care', 'Dental emergencies can happen anytime. SmileCare offers same-day emergency appointments for toothaches, broken teeth, knocked-out teeth, lost fillings or crowns, and dental abscesses. Call (206) 555-0123 immediately for emergency care. We answer emergency calls 24/7.', 'https://smilecare-dental.com/emergency'),
(1, 'faq', 'Insurance and Payment', 'SmileCare accepts most major dental insurance including Delta Dental, Cigna, Aetna, MetLife, United Healthcare, Guardian, and Blue Cross Blue Shield. Payment options include cash, credit card, CareCredit financing, and flexible payment plans. We also offer a SmileCare Membership Plan for $299/year for patients without insurance.', 'https://smilecare-dental.com/insurance'),
(1, 'team', 'Meet Dr. Sarah Johnson', 'Dr. Sarah Johnson is our lead dentist with over 15 years of experience in general and cosmetic dentistry. She graduated from University of Washington School of Dentistry with honors. Dr. Johnson is known for her warm, patient-centered approach that puts even anxious patients at ease.', 'https://smilecare-dental.com/team'),
(1, 'team', 'Meet Dr. Michael Chen', 'Dr. Michael Chen specializes in orthodontics and pediatric dentistry. He joined SmileCare in 2018 after completing his residency at Children''s Hospital. Dr. Chen has a special talent for working with young patients and making dental visits fun for children.', 'https://smilecare-dental.com/team'),
(1, 'service', 'Invisalign Clear Aligners', 'SmileCare offers Invisalign clear aligners as an alternative to traditional braces. These virtually invisible, removable aligners gradually straighten teeth. Treatment typically takes 12-18 months and costs $4,500. Benefits include no metal brackets, removable for eating, and fewer office visits than traditional braces.', 'https://smilecare-dental.com/invisalign'),
(1, 'location', 'Location and Hours', 'SmileCare Dental Clinic is located at 1234 Dental Avenue, Suite 100, Seattle, WA 98101. We are open Monday-Friday 8am-6pm and Saturday 9am-3pm. Closed Sundays except for emergencies. Free parking available. We serve the downtown Seattle community and surrounding areas.', 'https://smilecare-dental.com/contact'),
(1, 'service', 'Dental Implants', 'Dental implants are the gold standard for replacing missing teeth. SmileCare places titanium implants that fuse with jawbone and function like natural teeth. Each implant costs $3,500 and includes the post, abutment, and custom crown. Implants prevent bone loss and can last a lifetime with proper care.', 'https://smilecare-dental.com/implants');

-- ============================================
-- 13. CHATBOT DOCUMENTS - TechForge Solutions
-- ============================================

INSERT INTO chatbot_documents (website_id, source_type, title, raw_content, source_url) VALUES
(2, 'page', 'About TechForge Solutions', 'TechForge Solutions is a full-stack software development agency specializing in web applications, mobile apps, and cloud infrastructure. Since 2016, we have helped over 150 companies transform their ideas into powerful digital products. We are based in San Francisco with a distributed team across North America.', 'https://techforge-solutions.io'),
(2, 'service', 'Web Application Development', 'TechForge builds custom web applications using React, Vue.js, Next.js and modern frameworks. Our web solutions are responsive, performant, and scalable. Services include frontend and backend development, database design, API integration, and authentication systems. Typical web app project costs $75,000 and takes 3-6 months. We follow agile development with 2-week sprints.', 'https://techforge-solutions.io/services/web'),
(2, 'service', 'Mobile App Development', 'We develop native iOS and Android apps, plus cross-platform solutions using React Native and Flutter. Mobile app services include UX design, development, backend APIs, and App Store submission. Mobile projects typically cost $65,000 and take 3-5 months for MVP. We handle everything from concept to launch.', 'https://techforge-solutions.io/services/mobile'),
(2, 'process', 'Our Development Process', 'TechForge follows an agile development process. We start with Discovery & Planning (1-2 weeks), then Design Phase (2-4 weeks), then Development Sprints (ongoing 2-week sprints). Throughout the project you get daily Slack communication, weekly progress meetings, and bi-weekly sprint reviews. We use Jira for project management and GitHub for code.', 'https://techforge-solutions.io/process'),
(2, 'technology', 'Tech Stack', 'Our core technologies include: Frontend - React, Vue.js, Next.js, TypeScript. Backend - Node.js, Python, .NET Core, Java. Mobile - React Native, Flutter, Swift, Kotlin. Cloud - AWS, Google Cloud, Azure, Docker, Kubernetes. Databases - PostgreSQL, MongoDB, Redis. We choose technologies based on your requirements, not trends.', 'https://techforge-solutions.io/technology'),
(2, 'case-study', 'HealthTrack Telemedicine Platform', 'TechForge built a HIPAA-compliant telemedicine platform for HealthTrack using React and Node.js. The platform supports video consultations via Twilio, appointment scheduling, and encrypted health records. Launched in 6 months and now handles 10,000+ consultations per year with 99.9% uptime.', 'https://techforge-solutions.io/cases/healthtrack'),
(2, 'service', 'Cloud Infrastructure & DevOps', 'We optimize infrastructure with cloud-native architecture on AWS, Google Cloud, or Azure. Services include infrastructure as code, CI/CD pipelines, Docker containerization, Kubernetes orchestration, and monitoring setup. Cloud projects start at $35,000. We help reduce costs and improve reliability.', 'https://techforge-solutions.io/services/cloud'),
(2, 'pricing', 'Project Costs and Pricing', 'TechForge pricing ranges from $50,000 for simple applications to $500,000+ for enterprise systems. Factors affecting cost include complexity, features, design, and integrations. We provide transparent estimates after discovery phase. We can also build MVPs first and add features in phases to spread costs over time. Technical consulting available at $200-300 per hour.', 'https://techforge-solutions.io/pricing'),
(2, 'support', 'Post-Launch Support', 'TechForge offers ongoing support after launch including bug fixes, performance monitoring, security updates, and feature enhancements. Standard support packages start at $5,000/month. We also offer staff augmentation where our developers join your team on an ongoing basis.', 'https://techforge-solutions.io/support'),
(2, 'careers', 'Join TechForge Team', 'TechForge has a remote-first culture where team members work from anywhere in North America. We offer competitive salaries above industry average, $2,000 annual learning budget, comprehensive health benefits, unlimited PTO, and latest MacBook Pro. Current openings include Senior Full-Stack Developer, Mobile Developer, DevOps Engineer, and UI/UX Designer.', 'https://techforge-solutions.io/careers');

-- ============================================
-- 14. CHATBOT DOCUMENTS - LearnHub Academy
-- ============================================

INSERT INTO chatbot_documents (website_id, source_type, title, raw_content, source_url) VALUES
(3, 'page', 'About LearnHub Academy', 'LearnHub Academy is a leading online learning platform offering over 500 courses in technology, business, design, and personal development. Since 2017, we have helped more than 200,000 students worldwide advance their careers and learn new skills. All courses are self-paced with lifetime access. We offer certificates of completion.', 'https://learnhub-academy.edu'),
(3, 'pricing', 'LearnHub Pricing Plans', 'LearnHub offers multiple pricing options: Individual courses from $19.99-$199.99 with lifetime access. Monthly subscription for $29/month with access to all 500+ courses. Annual subscription for $199/year (save 40%). All subscriptions include 7-day free trial. Students with .edu email get 50% off annual subscription. 30-day money-back guarantee on all purchases.', 'https://learnhub-academy.edu/pricing'),
(3, 'course', 'Web Development Bootcamp', 'The Complete Web Development Bootcamp is our most popular course at $149.99. It covers HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB. Includes 60 hours of video and 15 real-world projects. No prior experience required. Students learn to build full-stack web applications and are ready for junior developer positions after completion.', 'https://learnhub-academy.edu/courses/web-dev-bootcamp'),
(3, 'course', 'Data Science with Python', 'Data Science with Python course costs $129.99 and includes 55 hours of content. Learn NumPy, Pandas, Matplotlib, Seaborn, and Scikit-learn for machine learning. Work with real Kaggle datasets and build end-to-end data projects. Perfect for career changers and analysts looking to upskill in data science.', 'https://learnhub-academy.edu/courses/data-science'),
(3, 'faq', 'How Subscriptions Work', 'LearnHub subscriptions give unlimited access to all 500+ courses for a flat fee. The monthly plan is $29/month and annual is $199/year. Both include 7-day free trial with no credit card required. Subscription members can download videos for offline learning. You can cancel anytime. When you cancel, you lose access but your progress is saved if you resubscribe later.', 'https://learnhub-academy.edu/how-it-works'),
(3, 'feature', 'Certificates and Career Value', 'LearnHub certificates of completion demonstrate that you have invested time learning valuable skills. While not accredited like university degrees, many employers value them as proof of initiative. Students regularly add LearnHub certificates to LinkedIn profiles and resumes. Some courses prepare you for industry certifications from Google, AWS, and PMI. 87% of students report career benefits after completing courses.', 'https://learnhub-academy.edu/certificates'),
(3, 'course', 'Digital Marketing Course', 'Complete Digital Marketing Course costs $99.99 and covers SEO, Google Ads, Facebook advertising, social media marketing, email marketing, content marketing, and Google Analytics. Includes 40 hours of video plus templates and checklists. Taught by certified marketers with agency experience. Ideal for entrepreneurs and business owners.', 'https://learnhub-academy.edu/courses/digital-marketing'),
(3, 'feature', 'Learning Platform Features', 'LearnHub platform features include: adjustable playback speed (0.5x to 2x), closed captions in multiple languages, take notes while watching, code along with in-browser IDE, track learning streak, download for offline viewing, and sync progress across all devices. Mobile apps available for iOS and Android. Most students spend 3-7 hours per week on courses.', 'https://learnhub-academy.edu/features'),
(3, 'business', 'Team and Enterprise Plans', 'LearnHub offers team plans starting at $299/year per member with admin dashboard to track progress and custom learning paths. For organizations with 20+ learners, we offer enterprise solutions with white-label platform options, custom course creation, advanced analytics, SSO integration, and dedicated support. Contact sales team for enterprise pricing.', 'https://learnhub-academy.edu/teams'),
(3, 'testimonial', 'Student Success Stories', 'LearnHub students report impressive career outcomes: 87% report career benefits, average salary increase of $15,000, 45% successfully change careers, and 92% would recommend LearnHub. Sarah M. changed from accountant to software developer and now earns $85k. James L. was promoted to Senior Data Analyst within 3 months. Maria G. started her own marketing agency after taking our digital marketing course.', 'https://learnhub-academy.edu/success-stories');

-- ============================================
-- 15. CHATBOT CHUNKS - SmileCare Dental
-- ============================================

-- Chunks from document 1 (Welcome)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(1, 1, 'SmileCare Dental Clinic is your trusted partner in oral health. We believe everyone deserves a healthy, beautiful smile. Located in downtown Seattle.', 0),
(1, 1, 'Our state-of-the-art facility offers comprehensive dental care for the entire family. Over 20 years of combined dental expertise.', 1),
(1, 1, 'We use the latest dental technology including digital X-rays and laser dentistry. Comfortable, anxiety-free environment designed for patient comfort.', 2);

-- Chunks from document 2 (General Dentistry)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(1, 2, 'SmileCare provides complete preventive and restorative dental care. Services include regular checkups, professional cleanings, fillings, and root canals.', 0),
(1, 2, 'We recommend checkups every 6 months to maintain optimal oral health. Our preventive approach catches problems early before they become serious and expensive.', 1),
(1, 2, 'Regular cleanings remove plaque and tartar buildup that regular brushing cannot reach. Preventive care is the foundation of good oral health.', 2);

-- Chunks from document 3 (Cosmetic)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(1, 3, 'Transform your smile with SmileCare cosmetic dentistry services. We offer professional teeth whitening, porcelain veneers, and complete smile makeovers.', 0),
(1, 3, 'Professional teeth whitening costs $499 and takes 90 minutes. Results are immediate with teeth becoming 3-8 shades whiter. Safe for enamel.', 1),
(1, 3, 'Dr. Sarah Johnson specializes in cosmetic dentistry with over 15 years experience. She creates natural-looking results that boost your confidence.', 2);

-- Chunks from document 4 (Emergency)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(1, 4, 'Dental emergencies do not wait for business hours. SmileCare offers same-day emergency appointments. Call (206) 555-0123 immediately.', 0),
(1, 4, 'We treat emergency cases including severe toothaches, broken teeth, knocked-out teeth, lost fillings or crowns, and dental abscesses. Emergency calls answered 24/7.', 1),
(1, 4, 'We reserve time slots each day specifically for urgent dental cases. Your dental emergency is our priority.', 2);

-- Chunks from document 5 (Insurance)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(1, 5, 'SmileCare accepts most major dental insurance plans including Delta Dental, Cigna, Aetna, MetLife, United Healthcare, Guardian, and Blue Cross Blue Shield.', 0),
(1, 5, 'Payment options include cash, credit card, CareCredit healthcare financing, and flexible payment plans for larger treatments.', 1),
(1, 5, 'SmileCare Membership Plan available for patients without insurance. Only $299 per year for adults, $199 for children. Includes two cleanings and 20% discount on treatments.', 2);

-- Chunks from document 6 (Dr. Johnson)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(1, 6, 'Dr. Sarah Johnson is our lead dentist with over 15 years of experience in general and cosmetic dentistry.', 0),
(1, 6, 'She graduated from University of Washington School of Dentistry with honors. Known for her warm, patient-centered approach.', 1),
(1, 6, 'Dr. Johnson specializes in creating beautiful smiles and puts even the most anxious patients at ease during treatment.', 2);

-- Chunks from document 7 (Dr. Chen)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(1, 7, 'Dr. Michael Chen specializes in orthodontics and pediatric dentistry. He joined SmileCare in 2018.', 0),
(1, 7, 'Dr. Chen completed his residency at Children''s Hospital. He has special talent for working with young patients.', 1),
(1, 7, 'Children love Dr. Chen because he makes dental visits fun and stress-free. He is gentle and patient with kids of all ages.', 2);

-- Chunks from document 8 (Invisalign)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(1, 8, 'SmileCare offers Invisalign clear aligners as modern alternative to traditional braces. Virtually invisible and removable.', 0),
(1, 8, 'Invisalign treatment typically takes 12-18 months and costs $4,500. Benefits include no metal brackets, removable for eating and cleaning.', 1),
(1, 8, 'Initial Invisalign consultation includes 3D imaging and personalized treatment plan. Fewer office visits required than traditional braces.', 2);

-- Chunks from document 9 (Location)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(1, 9, 'SmileCare Dental Clinic is located at 1234 Dental Avenue, Suite 100, Seattle, WA 98101. Serving downtown Seattle community.', 0),
(1, 9, 'Hours: Monday-Friday 8am-6pm, Saturday 9am-3pm. Closed Sundays except for emergencies. Free parking available.', 1),
(1, 9, 'Contact us at (206) 555-0123 or email info@smilecare-dental.com. Emergency calls answered 24/7.', 2);

-- Chunks from document 10 (Implants)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(1, 10, 'Dental implants are the gold standard for replacing missing teeth. SmileCare places titanium implants that fuse with jawbone.', 0),
(1, 10, 'Each dental implant costs $3,500 and includes the titanium post, abutment, and custom crown. Functions like natural tooth.', 1),
(1, 10, 'Implants prevent bone loss and do not affect adjacent healthy teeth. With proper care, dental implants can last a lifetime.', 2);

-- ============================================
-- 16. CHATBOT CHUNKS - TechForge Solutions
-- ============================================

-- Chunks from document 11 (About)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(2, 11, 'TechForge Solutions is a full-stack software development agency. We specialize in web applications, mobile apps, and cloud infrastructure.', 0),
(2, 11, 'Since 2016, TechForge has helped over 150 companies transform their ideas into powerful digital products. Based in San Francisco with distributed team.', 1),
(2, 11, 'Our team serves clients from startups to Fortune 500 companies across North America. We build software that scales.', 2);

-- Chunks from document 12 (Web Development)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(2, 12, 'TechForge builds custom web applications using React, Vue.js, Next.js and modern JavaScript frameworks. Solutions are responsive and scalable.', 0),
(2, 12, 'Web application services include frontend development, backend APIs, database design, authentication systems, and admin dashboards.', 1),
(2, 12, 'Typical web app project costs $75,000 and takes 3-6 months from discovery to deployment. We follow agile methodology with 2-week sprints.', 2);

-- Chunks from document 13 (Mobile)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(2, 13, 'TechForge develops native iOS and Android apps using Swift and Kotlin, plus cross-platform solutions using React Native and Flutter.', 0),
(2, 13, 'Mobile app services include UX design, development, backend API creation, push notifications, and App Store submission and approval process.', 1),
(2, 13, 'Mobile projects typically cost $65,000 and take 3-5 months for MVP launch. We handle everything from concept to App Store.', 2);

-- Chunks from document 14 (Process)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(2, 14, 'TechForge follows agile development process. Starts with Discovery & Planning (1-2 weeks), then Design Phase (2-4 weeks), then Development Sprints.', 0),
(2, 14, 'During development you get daily Slack communication, weekly progress meetings, and bi-weekly sprint reviews. Full transparency throughout project.', 1),
(2, 14, 'We use Jira for project management, GitHub for code repository, and Figma for designs. You have access to all project tracking tools.', 2);

-- Chunks from document 15 (Technology)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(2, 15, 'TechForge core technologies: Frontend - React, Vue.js, Next.js, TypeScript. Backend - Node.js, Python, .NET Core, Java.', 0),
(2, 15, 'Mobile technologies: React Native, Flutter, Swift, Kotlin. Cloud platforms: AWS, Google Cloud, Azure, Docker, Kubernetes.', 1),
(2, 15, 'Databases: PostgreSQL, MongoDB, Redis. We choose technologies based on your project requirements, not trends or hype.', 2);

-- Chunks from document 16 (Case Study)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(2, 16, 'TechForge built HealthTrack telemedicine platform - a HIPAA-compliant system for video consultations, appointment scheduling, and health records.', 0),
(2, 16, 'Platform uses React frontend and Node.js backend with Twilio integration for video calls. End-to-end encryption ensures patient data security.', 1),
(2, 16, 'HealthTrack launched in 6 months, now handles 10,000+ consultations per year with 99.9% uptime. Successfully passed security audit.', 2);

-- Chunks from document 17 (Cloud/DevOps)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(2, 17, 'TechForge optimizes infrastructure with cloud-native architecture on AWS, Google Cloud, or Azure. Infrastructure as code using Terraform.', 0),
(2, 17, 'DevOps services include CI/CD pipeline setup, Docker containerization, Kubernetes orchestration, monitoring with DataDog, and auto-scaling.', 1),
(2, 17, 'Cloud infrastructure projects start at $35,000. We help reduce operational costs and improve system reliability and deployment speed.', 2);

-- Chunks from document 18 (Pricing)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(2, 18, 'TechForge pricing ranges from $50,000 for simple applications to $500,000+ for complex enterprise systems.', 0),
(2, 18, 'Cost factors include project complexity, number of features, design requirements, third-party integrations, and timeline. Transparent pricing after discovery.', 1),
(2, 18, 'We can build MVP first and add features in phases to spread costs over time. Technical consulting available at $200-300 per hour.', 2);

-- Chunks from document 19 (Support)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(2, 19, 'TechForge offers post-launch support packages including bug fixes, performance monitoring, security updates, and feature enhancements.', 0),
(2, 19, 'Standard support package starts at $5,000 per month. Includes hosting management, security patches, and monthly maintenance updates.', 1),
(2, 19, 'Staff augmentation available where TechForge developers integrate with your existing team on ongoing basis. Flexible engagement models.', 2);

-- Chunks from document 20 (Careers)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(2, 20, 'TechForge has remote-first culture. Team members work from anywhere in North America. We believe great work happens with flexibility.', 0),
(2, 20, 'Benefits include competitive salaries above industry average, $2,000 annual learning budget, comprehensive health insurance, unlimited PTO, latest MacBook Pro.', 1),
(2, 20, 'Current openings: Senior Full-Stack Developer (React/Node), Mobile Developer (React Native), DevOps Engineer (AWS), UI/UX Designer, Technical Project Manager.', 2);

-- ============================================
-- 17. CHATBOT CHUNKS - LearnHub Academy
-- ============================================

-- Chunks from document 21 (About)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(3, 21, 'LearnHub Academy is leading online learning platform with over 500 courses in technology, business, design, and personal development.', 0),
(3, 21, 'Since 2017, LearnHub has helped more than 200,000 students worldwide advance their careers and learn new skills at their own pace.', 1),
(3, 21, 'All LearnHub courses are self-paced with lifetime access. Students earn certificates of completion to showcase on LinkedIn and resumes.', 2);

-- Chunks from document 22 (Pricing)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(3, 22, 'LearnHub pricing options: Individual courses from $19.99-$199.99 with lifetime access. Monthly subscription $29/month for all 500+ courses.', 0),
(3, 22, 'Annual subscription is $199/year - saves over 40% compared to monthly. All subscriptions include 7-day free trial with no credit card required.', 1),
(3, 22, 'Students with valid .edu email get 50% off annual subscription. 30-day money-back guarantee on all purchases, no questions asked.', 2);

-- Chunks from document 23 (Web Dev Bootcamp)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(3, 23, 'Complete Web Development Bootcamp is LearnHub most popular course priced at $149.99. Covers HTML, CSS, JavaScript, React, Node.js, Express, MongoDB.', 0),
(3, 23, 'Bootcamp includes 60 hours of video content and 15 real-world projects. Build portfolio site, e-commerce store, social media app, and REST API.', 1),
(3, 23, 'No prior programming experience required. By completion, students are ready for junior web developer positions. Includes career guidance and interview prep.', 2);

-- Chunks from document 24 (Data Science)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(3, 24, 'Data Science with Python course costs $129.99 and includes 55 hours of comprehensive content covering NumPy, Pandas, Matplotlib, Seaborn.', 0),
(3, 24, 'Learn machine learning with Scikit-learn. Build models for regression, classification, and clustering. Work with real datasets from Kaggle.', 1),
(3, 24, 'Perfect for career changers and business analysts looking to upskill in data science and machine learning. Includes Python fundamentals.', 2);

-- Chunks from document 25 (Subscriptions)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(3, 25, 'LearnHub subscription gives unlimited access to all 500+ courses for flat monthly or annual fee. Watch as many courses as you want simultaneously.', 0),
(3, 25, 'Monthly plan is $29/month, annual is $199/year. Both include 7-day free trial with no credit card required. Cancel anytime.', 1),
(3, 25, 'Subscription members can download videos for offline learning using mobile apps. When you cancel, you lose access but progress is saved for resubscription.', 2);

-- Chunks from document 26 (Certificates)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(3, 26, 'LearnHub certificates of completion demonstrate time invested learning valuable skills. While not accredited like degrees, employers value them as proof of initiative.', 0),
(3, 26, 'Students regularly add LearnHub certificates to LinkedIn profiles and resumes. Some courses prepare for industry certifications from Google, AWS, PMI.', 1),
(3, 26, 'Career outcomes: 87% of LearnHub students report career benefits after completing courses. Many report promotions, raises, and career changes.', 2);

-- Chunks from document 27 (Digital Marketing)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(3, 27, 'Complete Digital Marketing Course costs $99.99 and covers SEO optimization, Google Ads, Facebook advertising, social media marketing strategy.', 0),
(3, 27, 'Also includes email marketing, content marketing best practices, and Google Analytics for tracking. 40 hours of video plus templates and checklists.', 1),
(3, 27, 'Taught by certified digital marketers with real agency experience. Ideal for entrepreneurs, business owners, and aspiring marketing professionals.', 2);

-- Chunks from document 28 (Platform Features)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(3, 28, 'LearnHub platform features: adjustable playback speed (0.5x to 2x), closed captions in multiple languages, take notes while watching videos.', 0),
(3, 28, 'Additional features include code along with in-browser IDE, track your learning streak, download for offline viewing, sync progress across devices.', 1),
(3, 28, 'Mobile apps available for iOS and Android for learning on the go. Most students spend 3-7 hours per week on courses at their own pace.', 2);

-- Chunks from document 29 (Team Plans)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(3, 29, 'LearnHub team plans start at $299/year per member. Perfect for companies investing in employee training and professional development.', 0),
(3, 29, 'Team plans include admin dashboard to track team progress, custom learning paths, priority support, and bulk license discounts available.', 1),
(3, 29, 'For organizations with 20+ learners, enterprise solutions available with white-label options, custom courses, advanced analytics, SSO integration.', 2);

-- Chunks from document 30 (Success Stories)
INSERT INTO chatbot_chunks (website_id, document_id, chunk_text, chunk_index) VALUES
(3, 30, 'LearnHub students achieve impressive results: 87% report career benefits, average salary increase of $15,000, 45% successfully change careers completely.', 0),
(3, 30, 'Sarah M. changed from accountant to software developer after Web Dev Bootcamp, now earns $85k. James L. promoted to Senior Data Analyst in 3 months.', 1),
(3, 30, 'Maria G. started her own marketing agency after Digital Marketing course and now has 3 employees. 92% of students would recommend LearnHub.', 2);

-- ============================================
-- Verification Queries
-- ============================================

-- Count records per website
SELECT 'websites' as table_name, COUNT(*) as count FROM websites
UNION ALL
SELECT 'pages', COUNT(*) FROM pages
UNION ALL
SELECT 'faq_items', COUNT(*) FROM faq_items
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'contact_info', COUNT(*) FROM contact_info
UNION ALL
SELECT 'chatbot_documents', COUNT(*) FROM chatbot_documents
UNION ALL
SELECT 'chatbot_chunks', COUNT(*) FROM chatbot_chunks;

-- Show data distribution per website
SELECT 
    w.name as website,
    w.domain,
    (SELECT COUNT(*) FROM pages WHERE website_id = w.id) as pages,
    (SELECT COUNT(*) FROM faq_items WHERE website_id = w.id) as faqs,
    (SELECT COUNT(*) FROM services WHERE website_id = w.id) as services,
    (SELECT COUNT(*) FROM chatbot_documents WHERE website_id = w.id) as documents,
    (SELECT COUNT(*) FROM chatbot_chunks WHERE website_id = w.id) as chunks
FROM websites w
ORDER BY w.id;
