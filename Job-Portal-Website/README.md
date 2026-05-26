# 🎯 CareerHub - Job Portal Website

A modern, feature-rich job portal website inspired by Indeed, built with HTML, CSS, and JavaScript. No backend required!

## ✨ Features

### 🏠 Home Page (index.html)
- Professional hero section with search form
- Quick filter tags (Remote, Full-time, Entry Level, etc.)
- "Browse All Jobs" CTA button
- Saved jobs counter in navbar

### 💼 Job Listings (jobs.html)
- **4 Cards Per Row** grid layout (responsive)
- **Collapsible Filters** (click Filter button to show/hide)
- Filter by:
  - Experience Level (Entry, Mid, Senior)
  - Work Location (Remote, Hybrid, On-site)
  - Job Type (Full-time, Part-time, Contract)
  - Salary Range
- 16+ sample jobs with realistic data
- Save jobs feature (stores in localStorage)
- View details button for each job

### 📄 Job Details (job-details.html)
- Complete job description
- Key responsibilities
- Required qualifications
- Preferred skills
- **Compensation & Benefits** section
- **Employee Reviews** section with ratings and feedback
- Company details sidebar
- Company ratings (Work-Life Balance, Compensation, Career Growth, etc.)
- Similar jobs recommendations
- Apply and Save buttons

### 📝 Application Form (apply.html)
- Full-name, email, phone fields
- Current job title
- Years of experience selector
- Current location
- Motivation/cover letter textarea
- **Resume Upload** with:
  - Drag and drop support
  - File size display
  - PDF/DOC/DOCX support
  - Visual feedback
- Submit and Cancel buttons

### 🔐 Authentication (auth.html)
- **Sign In Form** with:
  - Social login options (Google, GitHub)
  - Email and password fields
  - Remember me checkbox
  - Forgot password link
- **Sign Up Form** with:
  - Full name, email, password fields
  - Confirm password
  - Terms and conditions checkbox
  - Social signup options
- Toggle between forms
- Success messages and redirects

### 🔖 Saved Jobs (saved-jobs.html)
- View all saved/bookmarked jobs
- Remove jobs from saved list
- Quick access to job details
- Empty state with browse jobs CTA

## 🎨 Design Features

- **Dark theme** with blue accent colors (#0066ff)
- **Professional color scheme**: Dark backgrounds with bright blue CTAs
- **Responsive design** - works on desktop, tablet, and mobile
- **Smooth transitions and hover effects**
- **Clean, modern UI** inspired by Indeed
- **Grid-based layout** for job cards

## 📱 Responsive Breakpoints

- **Desktop**: 4 cards per row
- **Tablet (1200px)**: 3 cards per row
- **Small Tablet (992px)**: 2 cards per row
- **Mobile (768px)**: 1 card per row, hidden nav links

## 🚀 How to Use

1. **Extract all files** to a folder
2. **Open index.html** in your browser
3. **Navigate** through the site using the navbar links

### Key Features to Try:

1. **Search Jobs**: Use the search form on the home page
2. **Filter Jobs**: Go to jobs page, click "Filters" button to show/hide filters
3. **View Job Details**: Click "View Details" on any job card
4. **Save Jobs**: Click the bookmark icon on job cards
5. **Apply for Job**: On job details page, click "Apply Now"
6. **Upload Resume**: On application form, upload a PDF/DOC file
7. **Sign In/Up**: Click "Sign In" or "Sign Up" in navbar
8. **View Saved**: Check "Saved Jobs" in navbar

## 📁 File Structure

```
job-portal/
├── index.html           (Home page)
├── jobs.html            (Job listings with filters)
├── job-details.html     (Job details & reviews)
├── apply.html           (Application form)
├── auth.html            (Sign in/Sign up)
├── saved-jobs.html      (Saved jobs list)
└── README.md           (This file)
```

## 💾 Data Storage

All data is stored in **browser localStorage**:
- `savedJobs` - Array of saved job IDs
- `applications` - Array of submitted applications

⚠️ **Note**: Data is stored locally in your browser and will be lost if you clear browser data.

## 🎯 Sample Jobs Included

16 diverse job positions:
- Senior Frontend Engineer (₹15-25 LPA)
- Data Scientist (₹12-22 LPA)
- DevOps Engineer (₹14-24 LPA)
- Full Stack Developer (₹13-23 LPA)
- UX/UI Designer (₹10-18 LPA)
- Product Manager (₹16-28 LPA)
- Mobile App Developer (₹11-20 LPA)
- Cybersecurity Analyst (₹12-21 LPA)
- QA Engineer (₹8-15 LPA)
- HR Recruiter (₹3.5-6 LPA)
- Business Analyst (₹5-9 LPA)
- Cloud Support Associate (₹4-7 LPA)
- Backend Engineer (₹14-26 LPA)
- Junior Developer (₹4-8 LPA)
- Solutions Architect (₹20-35 LPA)
- Part-time Content Writer (₹100-200/hour)

## 🔧 Customization

### Change Colors
Find `#0066ff` (primary blue) in the CSS and replace with your color.

### Add More Jobs
Edit the `allJobs` array in `jobs.html` and `jobsDatabase` in `saved-jobs.html` with your job data.

### Modify Filters
Edit the filter groups in `jobs.html` to add/remove filter options.

### Add Reviews
Edit the `reviews` array in `job-details.html` to change employee reviews.

## ✅ Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📋 Features Implemented

✅ Home page with Indeed-like design  
✅ 4 jobs per row grid layout  
✅ Collapsible filter button  
✅ Multiple filter categories  
✅ Job details page  
✅ Company reviews section  
✅ Application form with resume upload  
✅ Sign in/Sign up pages  
✅ Saved jobs page  
✅ Responsive design  
✅ Dark theme  
✅ localStorage data persistence  

## 🌟 Highlights

1. **No Backend Required** - Everything runs in the browser
2. **Fast Loading** - HTML/CSS/JS only, no external dependencies except Font Awesome
3. **Modern Design** - Clean, professional interface
4. **Fully Responsive** - Works on all devices
5. **Easy to Customize** - Simple HTML structure
6. **Realistic Data** - 16 sample jobs with complete details

## 📞 Technical Details

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **Vanilla JavaScript** - No frameworks or libraries (except Font Awesome icons)
- **LocalStorage API** - Browser-based data persistence
- **Responsive Design** - Mobile-first approach

## 🎓 Educational Value

Great for learning:
- HTML5 semantic elements
- CSS3 flexbox and grid layouts
- JavaScript DOM manipulation
- LocalStorage API usage
- Form handling and validation
- Responsive web design

## 📝 License

Free to use and customize for personal or commercial projects.

## 🚀 Future Enhancement Ideas

- Backend integration (save to database)
- User accounts and authentication
- Email notifications for new jobs
- Advanced search filters
- Job recommendations
- Company reviews section
- Messaging between employers and applicants
- Admin panel for job posting
- Analytics dashboard

---

**Made with ❤️ for job seekers and developers**

Start exploring opportunities today! 💼
