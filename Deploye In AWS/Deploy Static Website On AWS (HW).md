#### **Deploy Static Website On AWS**

**1. Create A Security Group / Allow HTTP HTTPS and SSH**

 	a) Find Security Group In EC2 Sidebar

 	b) Enter Basic Details Of Security Group Like Security Group Name And Description

 	c) Inbound rules Setup --> Add Rule and Allow HTTP HTTPS (Anywhere-IPv4) and SSH (My IP)

 	d) Outbound rules setup --> Type -- All Traffic \& Destination -- Anywhere IPv4

&nbsp;	e) Click Create Security Group



**2. Instances / CPU Setup On Server**

a) Find \*\*Instances\*\* In EC2 Sidebar


 	b) Click Launch an instance

 	c) CPU Name / Web Server Name (like - Filemoon, webhubmaster)

 	d) Choose Operating System

 		i) If Your Code in .net --> Window

 		ii) If Your Software Baise On Cloud and Rabot etc --> MAC

 		iii) if Your Software Baise On Enything Else Then Select ---> Linux

 				*There are many Types Of Liunx*

 					1 Amazon Linux

 					2 Red Hat

 					3 SUSE Linux

 					4 Ubuntu Linux ----> Very Popular in Small Range

 					5 Debian Linux -----> Mid Range And Enterprize Range

 	e) Genrate Key Pair

 		i) Click Create New Key Pair

 		ii) Enter Key Pair Name

 		iii) Key pair type **RSA**

&nbsp;	iv) Private key file format \*\*.ppk\*\*

	f) Firewall (security groups)

 		i) Select existing security group

 		ii) and choose security group which you create



3\. Setup Putty and Connect CPU

&nbsp;	a) Enter host name ya IP address (137.01.050.2)

&nbsp;	b) Save Session any name

&nbsp;	c) Go --> SSH --> Auth --> Credentials than upload private key file for auth --- > Choose .ppk file which you create when you setup instance

&nbsp;	d) Go appearance --> and change font-style and font size (Optional)

&nbsp;	e) Save and open



4\. Working on putty terminal 

&nbsp;	i) Type your username ubuntu / any which is your username

&nbsp;	ii) write sudo apt update to generate apt file

&nbsp;	iii) install nginx for response

&nbsp;		nginx installations process

&nbsp;			. sudo apt install nginx

&nbsp;	result --> your server give you nginx result



5\. Upload your file in server using FileZilla software

&nbsp;	i) Open FileZilla software and go to Edit --> Setting --> SFTP --> Add Key File --> Choose your .ppk file  which you create when you setup instance --> Click OK

&nbsp;	ii) type host --> 137.01.050.2 \& username --> ubuntu / any which is your username \& port --> 22 ---> quick Connect ---> Ok

&nbsp;	ii) find var folder and go adject path like this ---> /var/www/html

&nbsp;	iii) delete nginx html file before delete nginx html file allow access to delete and upload file

&nbsp;	iv) go putty terminal and write command --> sudo chown ubuntu /var/www/html (folder path like)

&nbsp;	v) upload your website file in server --> in your local pc go to the website folder and select all the file and click upload 



6\. Setup Route Using Route53 AWS feature

&nbsp;	i) search route53 --> get started --> hosted zone --> create hosted zone

&nbsp;	ii) enter your Domain name --> ex : webhubmaster.com  --> create hosted zone

&nbsp;	iii) create reoad -> no anything change only enter Value -- > value is your IP Address \& Record type -> A --> create reacod

&nbsp;	iv) allow www and hit your domain --> Record name --> www \& value --> your domain name (webhubmaster.shop) \& Record type -> CNAME --> create reacod 



7\. Optional but very powerfull when your website not appare

&nbsp;	i) go your domain provider and go to your domin

&nbsp;	ii) click Domin --> DNS --> DNS Record --> Edit Type A  --> Enter Data --> Data is your IP Address 

&nbsp;	iii) Then your website succesfully opend



8\. Get free ssl using putty terminal

sudo apt install certbot python3-certbot-nginx

sudo certbot --nginx -d {webhubmaster.shop} -d {www.webhubmaster.shop}

sudo certbot renew --dry-run



