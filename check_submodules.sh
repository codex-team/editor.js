submodules=$(grep path .gitmodules | sed 's/.*= //')
missing=false

while read -r line ; do
    if ! test -f "$line/.git"; then
        echo "    - $line submodule is not initialized."
        missing=true
    fi
done <<< "$submodules"

if [ "$missing" = true ] ; then
    printf "\n(!) Some modules are missing, consider running yarn pull_tools\n\n"
fi
