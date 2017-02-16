<?php

namespace CodexEditor\Entry;

class Structure {

    /**
     * @var array - blocks classes
     */
    public $blocks = [];

    /**
     * Splits json string to separate blocks
     *
     */
    public function __construct($json)
    {
        $data  = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            exit;
        }

        if (is_null($data) || count($data) === 0 || !isset($data['data']) || count($data['data']) === 0) {
            exit;
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

    /**
     * Returns entry blocks as separate array element
     *
     * @return array
     */
    public function getEntryData()
    {
        /**
         * $callback {Function} Closure
         */
        $callback = function($block) {
            return $block->getData();
        };

        return array_map( $callback, $this->blocks);

    }

}