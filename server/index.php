<?php

function file_get_contents_curl($url)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36');

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}

function get_url()
{
    if (!isset($_GET['url']))
    {
        return false;
    }

    $url = $_GET['url'];

    if (filter_var($url, FILTER_VALIDATE_URL) === FALSE) {
       return false;
    }
    
    return $url;
}

function get_meta_from_html($html)
{
    $doc = new DOMDocument();
    @$doc->loadHTML($html);
    $nodes = $doc->getElementsByTagName('title');

    $title = $nodes->item(0)->nodeValue;
    $description = "";
    $keywords = "";
    $image = "";

    $metas = $doc->getElementsByTagName('meta');

    for ($i = 0; $i < $metas->length; $i++)
    {
        $meta = $metas->item($i);
        if($meta->getAttribute('name') == 'description')
            $description = $meta->getAttribute('content');
        if($meta->getAttribute('name') == 'keywords')
            $keywords = $meta->getAttribute('content');
        if($meta->getAttribute('property')=='og:image'){ 
            $image = $meta->getAttribute('content');
        }
    }

    return [
        'image'         => $image,
        'title'         => $title,
        'description'   => $description
    ];
}

$url = get_url();

$url_params = parse_url($url);

if (!$url)
{
    exit(0);
}

$html = file_get_contents_curl($url);

$result = get_meta_from_html($html);

$result = array_merge(

    get_meta_from_html($html), 

    array(
        'linkUrl'   => $url,
        'linkText'  => $url_params["host"] . $url_params["path"],
    )

);

echo json_encode($result);

?>