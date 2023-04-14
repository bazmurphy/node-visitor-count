# Cloud Week 2 - Node Visitor Count
## Step by Step Instructions:

1. Launch Instance  
![image](https://user-images.githubusercontent.com/61154071/232098516-4e808ad8-96bb-44c1-85a5-70386d31bbde.png)  

2. Name and tags: Node Visitor Count  
![image](https://user-images.githubusercontent.com/61154071/232098945-4826bfc3-7be2-4aa7-8b12-758946689e12.png)  

3. Application and OS Images (Amazon Machine Image)  
![image](https://user-images.githubusercontent.com/61154071/232099095-41193df6-ba7b-49b0-982e-5ed724378e41.png)  

4. Instance type  
![image](https://user-images.githubusercontent.com/61154071/232099142-c35784c9-fb43-49fe-8362-7c2cf44173dc.png)  

5. Key pair (login)  
- Create key pair ( RSA / .pem )  
![image](https://user-images.githubusercontent.com/61154071/232099272-202c2467-67c4-4948-98c7-49cf0358be91.png)  
![image](https://user-images.githubusercontent.com/61154071/232105223-923a465c-b62e-446b-b2bb-fb264b278863.png)  
- Select Key pair name (^just generated):  
![image](https://user-images.githubusercontent.com/61154071/232100433-c27ad11c-be6c-4591-95cf-14dfbb47f5cf.png)  

6. Network settings:  
- Allow SSH traffic from: My IP (to restrict SSH)  
- We will later edit the firewall rules  
![image](https://user-images.githubusercontent.com/61154071/232101435-0b49042b-a503-4fbb-8197-e1b3f089a745.png)  

7. Configure storage  
![image](https://user-images.githubusercontent.com/61154071/232101613-74b794f9-0c9f-40ed-9211-20f3d565d35f.png)  

8. Summary
- Launch instance  
![image](https://user-images.githubusercontent.com/61154071/232101814-82c4aa12-46af-411f-a5db-7260e8c7d110.png)  

9. Instances
- Select the instance
![image](https://user-images.githubusercontent.com/61154071/232105951-d43b56b2-5582-4e41-91d3-a5b7bfbedaf0.png)
- On instance summary click the Security Tab
- Click on the Security Group  
![image](https://user-images.githubusercontent.com/61154071/232106806-dd508f42-ae58-4550-ab0e-062398f0b048.png)  

10. Security Group  
![image](https://user-images.githubusercontent.com/61154071/232107891-80db16b6-8dc0-4128-8c7a-189310cedd0c.png)
- Add rule
- Custom TCP  
- Port range: 3000  
- Source: Anywhere / 0.0.0.0/0  
- Save rules  
![image](https://user-images.githubusercontent.com/61154071/232108562-532a618e-3e3f-4716-9b75-382ddf51a732.png)

11. Install AWS CLI  
- `sudo apt install awscli`  
![image](https://user-images.githubusercontent.com/61154071/232109377-e0afd923-c2c8-4107-81fc-244cb9648b57.png)  

12. Move Key pair to cloud projects folder and make read only  
- ``mv ~/Downloads/cloud-week-two-visitor-count.pem ~/cloud/aws-keypairs/``  
![image](https://user-images.githubusercontent.com/61154071/232109921-14d04559-ee95-4bfe-bafc-a9332e224d6f.png)  
- `chmod 4000 cloud-week-two-visitor-count.pem`  
![image](https://user-images.githubusercontent.com/61154071/232110266-240ac501-68b4-4a16-9628-96b979de015a.png)  

12. Connect to EC2 Instance  
- `ssh -i "cloud-week-two-visitor-count.pem" ubuntu@ec2-xxx-xxx-xxx-xxx.compute-1.amazonaws.com`  
![image](https://user-images.githubusercontent.com/61154071/232110776-6b885dea-7b78-4570-86fb-7dd0b9136edd.png)  

13. Install Node Version Manager and then Node LTS
- `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`  
![image](https://user-images.githubusercontent.com/61154071/232112449-0f5f4594-4a15-44aa-bcbd-6aecdfe5634a.png)  
- `export NVM_DIR="$HOME/.nvm"`  
![image](https://user-images.githubusercontent.com/61154071/232113243-bdb924a8-89d8-40fe-b6ff-dd795b14832d.png)
- `nvm install --lts`
- `nvm use --lts`
![image](https://user-images.githubusercontent.com/61154071/232113498-e48a13d1-ac6a-4fed-b517-2c24e1baf95c.png)

14. Install PM2 (Process Manager)  
`npm install pm2@latest -g`  
![image](https://user-images.githubusercontent.com/61154071/232114819-21fc4c29-cb39-4593-8f85-68125f6b02c9.png)  

15. Clone the Node Express Visitor Count Application and change into the Repository Directory
- `git clone https://github.com/bazmurphy/node-visitor-count`  
- `cd node-visitor-count`  
![image](https://user-images.githubusercontent.com/61154071/232115400-26fa4d9f-23b8-4a33-b1c9-46c9232bee54.png)  

16. Install Node Packages for the Repository  
`npm install`  
![image](https://user-images.githubusercontent.com/61154071/232116039-59442683-61b4-4907-87b2-0c2be29b2bd6.png)  

17. Create .env file and edit it to add the `PORT=` and `MONGODB_URI=` values  
`touch .env`  
![image](https://user-images.githubusercontent.com/61154071/232117566-697c42f3-2ec8-45ec-aacd-72c00a6150e2.png)  
`nano .env`  
`PORT=3000`  
`MONGODB_URI=mongodb+srv://username:passwordd@clusterxxxxxx.mongodb.net/test?retryWrites=true&w=majority`  
![image](https://user-images.githubusercontent.com/61154071/232117767-2c957f12-aacd-4785-94a1-e3bf35b42e26.png)  
`Ctrl+O & Enter` (save)  
`Ctrl+X` (exit)  

17. Run the Application using PM2  
`pm2 start server.js`  
![image](https://user-images.githubusercontent.com/61154071/232119602-6aeaf16e-9c23-40ad-8acb-cbb3567dffa1.png)  

18. Visit the Live Application  
http://44.202.60.4:3000/  
![image](https://user-images.githubusercontent.com/61154071/232120700-236bb65a-2bee-4a3b-b5c2-e22b822db0ae.png)  

