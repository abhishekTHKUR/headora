Magento 2 Module: S3 DigitalOcean Space Storage
-----------------------------------------------

#### **Vendor Name: Ocode**

#### **Module Name: S3Digital**

#### Overview 

The S3Digital DigitalOcean Spaces: Scalable Cloud Storage for Magento 2

DigitalOcean Spaces offers a reliable cloud storage solution, enabling web applications to seamlessly store and serve images without relying on local file systems. By integrating cloud storage, businesses can scale their infrastructure effortlessly, adding more servers without the hassle of migrating existing images. This also enhances performance by offloading image retrieval to Spaces, reducing server load, and allowing easy integration with a CDN for optimized delivery.

The DigitalOcean Spaces Storage Extension for Magento 2 enables merchants to store product images, media files, and WYSIWYG assets directly in a Spaces bucket.

Instead of saving files in MySQL or the local filesystem, this extension overrides Magento's default storage system to upload assets directly to DigitalOcean Spaces. As a result, it maintains compatibility with third-party extensions that utilize Magento's file system APIs, ensuring seamless functionality with both existing and future Magento features.



## Features  

### Easy to Use  
This extension is simple to set up with minimal configuration! Just follow a few straightforward steps—one of which is creating a backup of your images for safety—and you'll be ready to go!  

### Sync All Your Media Images  
The following images are automatically stored in DigitalOcean Spaces:  

- **Product images**  
- **Generated thumbnails**  
- **WYSIWYG images**  
- **Category images**  
- **CAPTCHA images**  
- **Logos and favicons**  



![](https://workspace.ocode.co/media/attachments/0/3/3/9/eb04873a4011e0333be8123a33c17bcf8ab20c71ec1711e4cc72f07b2f21/screenshot-from-2025-02-05-11-33-25.png?token=Z6L_Xw%3An3Jf0ZRW5Jp39Alh0uwnV38F1DoQNPQQfwkXy6L9Rlbb8oDltBGDDOlurQ9VzzDGn-49JkoES2p2ITtY09fnwA#_taiga-refresh=userstory:1012)



####  Module Installation Steps:-

To install the module via Composer, follow these steps:

**Step 1**: Install the module     
Run the following command in the Magento 2 root directory:

**composer require ocode/s3digital**   
**Step 2**: Enable the module

**php bin/magento module:enable Ocode\_S3Digital**   
**Step 3**: Run the setup upgrade command

**php bin/magento setup:upgrade**   
**Step 4**: Compile dependencies (for production mode)

**php bin/magento setup:di:compile**   
**Step 5**: Deploy static content (if necessary)

**php bin/magento setup:static-content:deploy**   
**Step 6**: Clear the cache

**php bin/magento cache:flush**

####  Module Configuration in Magento Admin:-

After installation, configure the module in the Magento Admin Panel:

Navigate to: Stores -> Configuration -> Ocode -> DigitalOcean Space.     
Enable the extension.     
Enter the following credentials to establish a connection:     
Access Key     
Secret Key     
Bucket Name     
Endpoint URL (provided by DigitalOcean Spaces)     
Save the configuration.     
Test Connection     
A "Check Connection" button is available in the admin panel to verify the connection with DigitalOcean Spaces. If the credentials are correct, you will see a success message.

####  Syncing Media to DigitalOcean Spaces:-

**Step 1**: Export Magento 2 media files to DigitalOcean Spaces     
Run the following command to sync all media files:

**php bin/magento s3digital:export**   
This command exports all media folder data from Magento 2 to DigitalOcean Spaces.

**Step 2**: Enable DigitalOcean Spaces Storage in Magento 2     
Once the export is successful, run the following command to configure Magento to serve media from DigitalOcean Spaces:

**php bin/magento s3digital:enable**   
This command sets DigitalOcean Spaces as the primary media storage for Magento 2.

**Step 3**: Disable DigitalOcean Spaces Storage (if needed)     
If you want to switch back to local storage, run the following command:

**php bin/magento s3digital:disable**

####  Final Step: Configure Media URLs in Magento:-

To ensure media files are loaded from DigitalOcean Spaces, update the Secure and Unsecure Media URLs in the Magento 2 Admin Panel:

**Go to: Stores -> Configuration -> Web -> Base URLs.**   
Set the following fields to your DigitalOcean CDN URL:     
Base URL for User Media Files: https://your-cdn-url/     
Base URL for User Media Files (Secure): https://your-cdn-url/     
Save the configuration and clear the cache:

php bin/magento cache:flush     
Conclusion     
This module allows Magento 2 to offload media storage to DigitalOcean Spaces, significantly improving performance, scalability, and load times by leveraging a CDN.

Let me know if you need further refinements!

Demo Url: [https://dev2.diamondtrov.com/](https://dev2.diamondtrov.com/)

Admin URL: [https://dev2.diamondtrov.com/admin](https://dev2.diamondtrov.com/admin)
Username: admin
Password: ocode@123#

Github:  [https://github.com/browsewire/magento-cdn/tree/main/app/code/Ocode/S3Digital](https://github.com/browsewire/magento-cdn/tree/main/app/code/Ocode/S3Digital)