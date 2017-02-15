<?php

namespace CodexEditor\Entry;

class Structure {

    /**
     * @var array - block classes
     */
    public $blocks = [];

    public function __construct($json)
    {
        $data  = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            echo 'Oh, give me that shit!!';
        }

        if (is_null($data) || count($data) === 0 || !isset($data['data']) || count($data['data']) === 0) {
            echo 'what the hell?';
        }

        $blocks = [];

        foreach ($data['data'] as $blockData) {

            if (is_array($blockData)) {
                try {

                    array_push($blocks, Factory::getBlock($blockData));

                } catch (Exception $e) {

                    var_dump($e);
                }
            }
        }

        $this->blocks = $blocks;

    }

}