<?php

function file_get_contents_curl($url)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}

function get_url_params()
{

    if (isset($_GET['url']))
    {
        $url = $_GET['url'];
        preg_match("/\b(?:(?:https?):\/\/)([-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|])/i", $url, $result);
        if (!$result)
        {
            return false;
        }
        else
        {
            return $result;
        }
    }
    else 
    {
        return false;
    }

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
        'linkUrl'       => $url,
        'linkText'      => $shortUrl,
        'image'         => $image,
        'title'         => $title,
        'description'   => $description
    ];
}

$url = get_url_params();

if (!$url)
{
    exit(0);
}

$html = file_get_contents_curl($url[0]);

$result = get_meta_from_html($html);

echo json_encode($result);

?>