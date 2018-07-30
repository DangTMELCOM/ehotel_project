#!/bin/sh
echo "Start setup"
cd /core/ehotel/service/app/service_modules

echo "SETUP NODEJS"
curl --silent --location https://rpm.nodesource.com/setup | bash -
yum -y install nodejs

yes | yum install npm

echo "SETUP NODEJS COMPLETE!"

npm install forever -g
npm install nodemon -g
npm install

npm install --save nodemailer
npm install --save nodemailer-smtp-transport
npm install --save html-entities

echo "Moving file"
\cp service/service_3120 /etc/init.d/
\cp service/service_3000 /etc/init.d/
\cp service/service_8887 /etc/init.d/
\cp service/service_8888 /etc/init.d/

echo "Move DONE"
cd /etc/init.d/
echo "Following file execute...."
chmod a+x service_3120
chmod a+x service_3000
chmod a+x service_8887
chmod a+x service_8888
echo "Add execute file DONE"

echo "Add service"
chkconfig --add service_3120
chkconfig --level 235 service_3120 on

chkconfig --add service_3000
chkconfig --level 235 service_3000 on

chkconfig --add service_8887
chkconfig --level 235 service_8887 on

chkconfig --add service_8888
chkconfig --level 235 service_8888 on

echo "Add service DONE"

echo "All setup complete!"

