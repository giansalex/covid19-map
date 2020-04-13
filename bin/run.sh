echo "Start download COVID data"

DATA_DIR="./data" node ./script/download-data.js

x=$?

if [ "$x" -eq "0" ]; then
	echo "Building publish package"
else
	echo "No deployment required"
	exit 0
fi

publishDir="./publish"
npm run build
mkdir -p $publishDir
cp index.html $publishDir
cp manifest.json $publishDir
cp favicon.png $publishDir
cp -r images $publishDir
cp -r dist $publishDir
cp -r data $publishDir

echo "Upload publish to IPFS"

ipfsHash=$(UPLOAD_DIR=$publishDir node script/upload-ipfs.js)

x=$?

if [ "$x" -eq "0" ]; then
	echo "Updating DNSLink to $ipfsHash"
else
    echo "Error publishing to IPFS"
	exit 0
fi

IPFS_HASH=$ipfsHash node ./script/update-dnslink.js
