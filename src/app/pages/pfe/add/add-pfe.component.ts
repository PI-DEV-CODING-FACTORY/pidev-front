import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PfeService } from '../../../services/pfe.service';
import { Pfe, PfeStatus } from '../../../models/pfe.model';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';

// Define OpenFor enum
enum OpenFor {
  INTERNSHIP = 'INTERNSHIP',
  JOB = 'JOB',
  BOTH = 'BOTH'
}

// Define the Technologies enum to match the backend
enum Technologies {
  JAVA = 'JAVA',
  JAVASCRIPT = 'JAVASCRIPT',
  TYPESCRIPT = 'TYPESCRIPT',
  PYTHON = 'PYTHON',
  RUBY = 'RUBY',
  PHP = 'PHP',
  SWIFT = 'SWIFT',
  KOTLIN = 'KOTLIN',
  C = 'C',
  C_PLUS_PLUS = 'C_PLUS_PLUS',
  C_SHARP = 'C_SHARP',
  GO = 'GO',
  RUST = 'RUST',
  SCALA = 'SCALA',
  PERL = 'PERL',
  HTML = 'HTML',
  CSS = 'CSS',
  SASS = 'SASS',
  LESS = 'LESS',
  SQL = 'SQL',
  NOSQL = 'NOSQL',
  POSTGRESQL = 'POSTGRESQL',
  MYSQL = 'MYSQL',
  MONGODB = 'MONGODB',
  FIREBASE = 'FIREBASE',
  REDIS = 'REDIS',
  APACHE_CASSANDRA = 'APACHE_CASSANDRA',
  NEO4J = 'NEO4J',
  HADOOP = 'HADOOP',
  SPARK = 'SPARK',
  KAFKA = 'KAFKA',
  DOCKER = 'DOCKER',
  KUBERNETES = 'KUBERNETES',
  JENKINS = 'JENKINS',
  GIT = 'GIT',
  GITHUB_ACTIONS = 'GITHUB_ACTIONS',
  CI_CD = 'CI_CD',
  AWS = 'AWS',
  AZURE = 'AZURE',
  GOOGLE_CLOUD = 'GOOGLE_CLOUD',
  SPRING_BOOT = 'SPRING_BOOT',
  EXPRESS_JS = 'EXPRESS_JS',
  NEST_JS = 'NEST_JS',
  DJANGO = 'DJANGO',
  FLASK = 'FLASK',
  RUBY_ON_RAILS = 'RUBY_ON_RAILS',
  LARAVEL = 'LARAVEL',
  FASTAPI = 'FASTAPI',
  REACT = 'REACT',
  ANGULAR = 'ANGULAR',
  VUE_JS = 'VUE_JS',
  NEXT_JS = 'NEXT_JS',
  NUXT_JS = 'NUXT_JS',
  SVELTE = 'SVELTE',
  LIT = 'LIT',
  TAILWIND_CSS = 'TAILWIND_CSS',
  BOOTSTRAP = 'BOOTSTRAP',
  MATERIAL_UI = 'MATERIAL_UI',
  THREE_JS = 'THREE_JS',
  D3_JS = 'D3_JS',
  ELECTRON = 'ELECTRON',
  IONIC = 'IONIC',
  REACT_NATIVE = 'REACT_NATIVE',
  FLUTTER = 'FLUTTER',
  SWIFT_UI = 'SWIFT_UI',
  UNITY = 'UNITY',
  UNREAL_ENGINE = 'UNREAL_ENGINE',
  OPENCV = 'OPENCV',
  TENSORFLOW = 'TENSORFLOW',
  PYTORCH = 'PYTORCH',
  SCIKIT_LEARN = 'SCIKIT_LEARN',
  NUMPY = 'NUMPY',
  PANDAS = 'PANDAS',
  MATPLOTLIB = 'MATPLOTLIB',
  SEABORN = 'SEABORN',
  LANGCHAIN = 'LANGCHAIN',
  OPENAI = 'OPENAI',
  HUGGINGFACE = 'HUGGINGFACE',
  SELENIUM = 'SELENIUM',
  CYPRESS = 'CYPRESS',
  PLAYWRIGHT = 'PLAYWRIGHT',
  JUNIT = 'JUNIT',
  TESTNG = 'TESTNG',
  MOCHA = 'MOCHA',
  JEST = 'JEST',
  CHAI = 'CHAI',
  CUCUMBER = 'CUCUMBER',
  POSTMAN = 'POSTMAN',
  SOAP_UI = 'SOAP_UI',
  GRAPHQL = 'GRAPHQL',
  REST_API = 'REST_API',
  SOAP = 'SOAP',
  WEBASSEMBLY = 'WEBASSEMBLY',
  ELASTICSEARCH = 'ELASTICSEARCH',
  LOGSTASH = 'LOGSTASH',
  KIBANA = 'KIBANA',
  METABASE = 'METABASE',
  TABLEAU = 'TABLEAU',
  POWER_BI = 'POWER_BI',
  PROMETHEUS = 'PROMETHEUS',
  GRAFANA = 'GRAFANA',
  TERRAFORM = 'TERRAFORM',
  ANSIBLE = 'ANSIBLE',
  PULUMI = 'PULUMI',
  BAZEL = 'BAZEL'
}

@Component({
  selector: 'app-add-pfe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    ToastModule,
    CardModule,
    DividerModule,
    FileUploadModule,
    ProgressBarModule,
    TooltipModule,
    InputGroupModule,
    InputGroupAddonModule,
    TagModule,
    MultiSelectModule
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">{{isEditMode ? 'Edit PFE Project' : 'New PFE Project'}}</h1>
              <p class="mt-2 text-lg text-gray-600">{{isEditMode ? 'Update your PFE details' : 'Submit your PFE details'}}</p>
            </div>
            <p-tag [severity]="isEditMode ? 'warn' : 'info'" [value]="isEditMode ? 'Editing' : 'New Submission'" icon="pi pi-file-edit" class="mt-4 md:mt-0"></p-tag>
          </div>
        </div>
        
        <!-- Loading Indicator -->
        <div *ngIf="isLoading" class="p-6 flex flex-col items-center justify-center">
          <div class="w-full bg-blue-100 rounded-lg p-4 mb-4">
            <div class="flex items-center">
              <i class="pi pi-spin pi-spinner text-blue-500 mr-2 text-xl"></i>
              <span class="text-blue-700 font-medium">Loading PFE data...</span>
            </div>
          </div>
          <p-progressBar mode="indeterminate" [style]="{'height': '6px'}" class="w-full"></p-progressBar>
        </div>
        
        <!-- Form -->
        <div class="p-6" [class.opacity-50]="isLoading">
          <form [formGroup]="pfeForm" (ngSubmit)="onSubmit()" class="space-y-8" [class.pointer-events-none]="isLoading">
            <!-- Basic Information Section -->
            <div>
              <h2 class="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Basic Information
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="col-span-1">
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Project Title*</label>
                  <input 
                    pInputText 
                    id="title" 
                    type="text" 
                    formControlName="title" 
                    class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                    pTooltip="Enter a descriptive title for your project" 
                  />
                  <small *ngIf="pfeForm.get('title')?.invalid && (pfeForm.get('title')?.touched || isSubmitted)" class="text-red-500 text-xs mt-1 block">
                    Project title is required
                  </small>
                </div>
                
                <div class="col-span-1">
                  <label for="githubUrl" class="block text-sm font-medium text-gray-700 mb-1">GitHub URL*</label>
                  <div class="flex">
                    <div class="bg-gray-100 flex items-center justify-center px-3 rounded-l-lg border border-r-0 border-gray-300">
                      <i class="pi pi-github text-gray-500"></i>
                    </div>
                    <input 
                      pInputText 
                      id="githubUrl" 
                      type="text" 
                      formControlName="githubUrl" 
                      placeholder="https://github.com/username/repo" 
                      class="w-full p-3 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <small *ngIf="pfeForm.get('githubUrl')?.invalid && (pfeForm.get('githubUrl')?.touched || isSubmitted)" class="text-red-500 text-xs mt-1 block">
                    GitHub URL is required
                  </small>
                </div>
                
                <div class="col-span-1 md:col-span-2">
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Project Description*</label>
                  <textarea 
                    pTextarea 
                    id="description" 
                    formControlName="description" 
                    rows="5" 
                    placeholder="Provide a detailed description of your project..." 
                    class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                  <small *ngIf="pfeForm.get('description')?.invalid && (pfeForm.get('description')?.touched || isSubmitted)" class="text-red-500 text-xs mt-1 block">
                    Project description is required (minimum 50 characters)
                  </small>
                  <div *ngIf="pfeForm.get('description')?.value" class="mt-2">
                    <div class="flex justify-between items-center mb-1">
                      <small class="text-gray-500">Character count: {{pfeForm.get('description')?.value.length}} / 50 minimum</small>
                      <small [ngClass]="getDescriptionProgressTextClass()">{{getDescriptionProgressText()}}</small>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div [ngClass]="getDescriptionProgressClass()" [ngStyle]="{'width': getDescriptionProgress() + '%'}" class="h-1.5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Additional Details Section -->
            <div>
              <h2 class="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Additional Details
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="col-span-1">
                  <label for="openFor" class="block text-sm font-medium text-gray-700 mb-1">Open For*</label>
                  <p-dropdown
                    id="openFor"
                    [options]="openForOptions"
                    formControlName="openFor"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select option"
                    [style]="{'width':'100%'}"
                  ></p-dropdown>
                  <small *ngIf="pfeForm.get('openFor')?.invalid && (pfeForm.get('openFor')?.touched || isSubmitted)" class="text-red-500 text-xs mt-1 block">
                    Please select an option
                  </small>
                </div>
                
                <div class="col-span-1">
                  <label for="technologies" class="block text-sm font-medium text-gray-700 mb-1">Technologies*</label>
                  <p-multiSelect
                    id="technologies"
                    [options]="technologiesOptions"
                    formControlName="technologies"
                    optionLabel="label"
                    optionValue="value"
                    [filter]="true"
                    placeholder="Select technologies"
                    [style]="{'width': '100%'}"
                    class="w-full"
                    [maxSelectedLabels]="3"
                    selectedItemsLabel="{0} technologies selected"
                  ></p-multiSelect>
                  <small *ngIf="pfeForm.get('technologies')?.invalid && (pfeForm.get('technologies')?.touched || isSubmitted)" class="text-red-500 text-xs mt-1 block">
                    At least one technology is required
                  </small>
                </div>
              </div>
            </div>
            
            <!-- Project Report Section -->
            <div>
              <h2 class="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Project Report
              </h2>
              <div>
                <label for="rapport" class="block text-sm font-medium text-gray-700 mb-3">
                  Project Report (PDF){{isEditMode ? ' (Optional in edit mode)' : '*'}}
                </label>
                <div 
                  class="border-2 border-dashed rounded-lg p-6 bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition-all duration-200"
                  [ngClass]="{'border-blue-300 bg-blue-50': selectedFile, 'border-gray-300': !selectedFile}"
                  (click)="fileInput.click()"
                >
                  <input #fileInput type="file" accept=".pdf" (change)="onFileSelected($event)" class="hidden" />
                  <i 
                    class="pi pi-file-pdf text-5xl mb-3" 
                    [ngClass]="{'text-blue-500': selectedFile, 'text-gray-400': !selectedFile}"
                  ></i>
                  <div *ngIf="!selectedFile" class="space-y-1">
                    <p class="font-medium text-gray-700">Drag and drop your PDF here or click to browse</p>
                    <p class="text-sm text-gray-500">Maximum file size: 10MB</p>
                  </div>
                  <div *ngIf="selectedFile" class="space-y-1 text-blue-600">
                    <p class="font-medium">{{selectedFile.name}}</p>
                    <p class="text-sm text-blue-500">{{formatFileSize(selectedFile.size)}}</p>
                    <button 
                      type="button" 
                      class="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-500 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      (click)="$event.stopPropagation()"
                    >
                      <i class="pi pi-refresh mr-1.5"></i>
                      Change File
                    </button>
                  </div>
                </div>
                <small *ngIf="!selectedFile && isSubmitted && !isEditMode" class="text-red-500 text-xs mt-1 block">
                  Project report is required for new submissions
                </small>
              </div>
            </div>
            
            <!-- Form Actions -->
            <div class="pt-6 border-t border-gray-200">
              <div class="flex justify-end space-x-3">
                <button 
                  pButton 
                  type="button" 
                  label="Cancel" 
                  icon="pi pi-times" 
                  class="p-button-outlined p-0 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md"
                  (click)="cancel()"
                  [disabled]="isLoading"
                ></button>
                <button 
                  pButton 
                  type="submit" 
                  [label]="isEditMode ? 'Update PFE Project' : 'Submit PFE Project'" 
                  icon="pi pi-check" 
                  class="p-button-primary p-0 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  [disabled]="isLoading"
                ></button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <p-toast position="top-right"></p-toast>
  `
})
export class AddPfeComponent implements OnInit {
  pfeForm!: FormGroup;
  selectedFile: File | null = null;
  isSubmitted = false;
  isEditMode = false;
  pfeId: number | null = null;
  existingPfe: any = null;
  isLoading = false;
  
  // Options for the OpenFor dropdown
  openForOptions = [
    { label: 'Internship', value: OpenFor.INTERNSHIP },
    { label: 'Job', value: OpenFor.JOB },
    { label: 'Both', value: OpenFor.BOTH }
  ];

  // Technologies options for multiselect
  technologiesOptions = Object.keys(Technologies).map(key => ({
    label: key.replace(/_/g, ' '),
    value: key
  }));
  
  constructor(
    private fb: FormBuilder,
    private pfeService: PfeService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    this.initForm();
    
    // Check if we're in edit mode by looking for an ID parameter
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pfeId = +id;
        this.isEditMode = true;
        this.loadPfeDetails(this.pfeId);
      }
    });
  }
  
  loadPfeDetails(id: number) {
    this.isLoading = true;
    this.pfeService.getPfeById(id).subscribe({
      next: (pfe) => {
        this.existingPfe = pfe;
        this.populateForm(pfe);
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load PFE details for editing'
        });
        console.error('Error loading PFE details:', error);
        this.isLoading = false;
        this.router.navigate(['/pfes']);
      }
    });
  }
  
  populateForm(pfe: any) {
    // Convert technologies from string to array for multiselect
    let technologies = [];
    
    if (pfe.technologies) {
      if (Array.isArray(pfe.technologies)) {
        technologies = pfe.technologies;
      } else if (typeof pfe.technologies === 'string') {
        // Split comma-separated string into array
        technologies = pfe.technologies.split(',').map((tech: string) => tech.trim());
      }
    }
    
    // Use setTimeout to ensure the form is populated after Angular's change detection cycle
    setTimeout(() => {
      this.pfeForm.patchValue({
        title: pfe.title || '',
        description: pfe.description || '',
        technologies: technologies,
        openFor: pfe.openFor || OpenFor.INTERNSHIP,
        githubUrl: pfe.githubUrl || ''
      });
      
      // Mark the form as pristine and untouched after populating
      this.pfeForm.markAsPristine();
      this.pfeForm.markAsUntouched();
    });
  }
  
  initForm() {
    this.pfeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(2000)]],
      technologies: [[], Validators.required],
      openFor: [OpenFor.INTERNSHIP, Validators.required],
      githubUrl: ['', Validators.pattern('https://github.com/.*')]
    });
  }
  
  getDescriptionProgress(): number {
    const description = this.pfeForm.get('description')?.value || '';
    const minLength = 50;
    const targetLength = 200;
    const progress = Math.min(100, (description.length / targetLength) * 100);
    return description.length < minLength ? Math.min(49, progress) : progress;
  }
  
  getDescriptionProgressClass(): string {
    const progress = this.getDescriptionProgress();
    if (progress < 50) return 'bg-red-500';
    if (progress < 100) return 'bg-orange-500';
    return 'bg-green-500';
  }
  
  getDescriptionProgressText(): string {
    const progress = this.getDescriptionProgress();
    if (progress < 50) return 'Too short';
    if (progress < 100) return 'Almost there';
    return 'Good length';
  }
  
  getDescriptionProgressTextClass(): string {
    const progress = this.getDescriptionProgress();
    if (progress < 50) return 'text-red-500 font-medium';
    if (progress < 100) return 'text-orange-500 font-medium';
    return 'text-green-500 font-medium';
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Please select a valid PDF file'
      });
    }
  }
  
  onSubmit() {
    this.isSubmitted = true;
    
    if (this.pfeForm.invalid) {
      // Log which fields are invalid to help with debugging
      const invalidFields = Object.keys(this.pfeForm.controls)
        .filter(key => this.pfeForm.controls[key].invalid)
        .map(key => {
          const errors = this.pfeForm.controls[key].errors;
          return `${key}: ${JSON.stringify(errors)}`;
        });
      
      console.error('Invalid form fields:', invalidFields);
      
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly'
      });
      return;
    }
    
    // In add mode, file is required
    if (!this.isEditMode && !this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Required',
        detail: 'Please upload a PDF file for the PFE report'
      });
      return;
    }
    
    if (this.isEditMode) {
      this.updatePfe();
    } else {
      this.createNewPfe();
    }
  }
  
  createNewPfe() {
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Required',
        detail: 'Please upload a PDF file for the PFE report'
      });
      return;
    }

    // Show loading indicator
    this.isLoading = true;
    
    const formData = new FormData();
    formData.append('rapport', this.selectedFile);
    formData.append('title', this.pfeForm.get('title')?.value);
    formData.append('description', this.pfeForm.get('description')?.value);
    
    // Convert technologies array to comma-separated string
    const technologies = this.pfeForm.get('technologies')?.value;
    if (Array.isArray(technologies)) {
      formData.append('technologies', technologies.join(','));
    } else {
      formData.append('technologies', technologies || '');
    }
    
    // Add required fields with default values
    formData.append('startDate', new Date().toISOString());
    formData.append('endDate', new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString());
    formData.append('supervisor', 'To be assigned');
    formData.append('company', 'To be assigned');
    formData.append('status', PfeStatus.PENDING);
    
    // Add studentId with a default value (will be overridden by the backend)
    formData.append('studentId', '1');
    
    formData.append('openFor', this.pfeForm.get('openFor')?.value);
    
    const githubUrl = this.pfeForm.get('githubUrl')?.value;
    if (githubUrl) {
      formData.append('githubUrl', githubUrl);
    }

    // Log the form data for debugging
    console.log('Creating PFE with form data:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    this.pfeService.createPfeWithFile(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'PFE created successfully'
        });
        this.router.navigate(['/pfes', response.id]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating PFE:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to create PFE. Please try again.'
        });
      }
    });
  }
  
  updatePfe() {
    if (!this.pfeId || !this.existingPfe) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot update PFE: Missing ID or original data'
      });
      return;
    }
    
    // Show loading indicator
    this.isLoading = true;
    
    // Get technologies as array and convert to comma-separated string
    const technologiesArray = this.pfeForm.get('technologies')?.value;
    const technologiesString = Array.isArray(technologiesArray) 
      ? technologiesArray.join(',') 
      : (technologiesArray || '');
    
    // Create a partial Pfe object with the form values
    const pfeData: Partial<Pfe> = {
      id: this.pfeId,
      title: this.pfeForm.get('title')?.value,
      description: this.pfeForm.get('description')?.value,
      technologies: technologiesString,
      status: this.existingPfe?.status || PfeStatus.PENDING,
      // Preserve existing values for required fields
      startDate: this.existingPfe.startDate,
      endDate: this.existingPfe.endDate,
      supervisor: this.existingPfe.supervisor,
      company: this.existingPfe.company,
      // Add studentId with the existing value or a default
      studentId: this.existingPfe.studentId || 1
    };
    
    // Add additional properties that are not in the Pfe interface
    const fullPfeData = {
      ...pfeData,
      openFor: this.pfeForm.get('openFor')?.value
    } as any;
    
    // Add optional properties
    const githubUrl = this.pfeForm.get('githubUrl')?.value;
    if (githubUrl) {
      fullPfeData.githubUrl = githubUrl;
    }
    
    // Preserve existing values that shouldn't be changed during update
    if (this.existingPfe) {
      // Note: studentId is already included in pfeData above
      fullPfeData.reportUrl = this.existingPfe.reportUrl || this.existingPfe.rapportUrl;
      fullPfeData.createdAt = this.existingPfe.createdAt;
    }

    // Log the update data for debugging
    console.log('Updating PFE with data:', fullPfeData);

    this.pfeService.updatePfe(this.pfeId, fullPfeData).subscribe({
      next: (updatedPfe) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'PFE updated successfully'
        });
        this.router.navigate(['/pfes', this.pfeId]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error updating PFE:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to update PFE. Please try again.'
        });
      }
    });
  }
  
  cancel() {
    this.router.navigate(['/pfes']);
  }
} 