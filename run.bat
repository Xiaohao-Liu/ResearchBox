echo CWD: %~dp0
cd .\ResearchBox\
set CWD=%~dp0
set DISTFolder=%CWD%ResearchBox\dist

if not exist %DISTFolder% (
	echo build dist
	npm run build
)else (
	echo dist built 
)
cls
npm run backend
