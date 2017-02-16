<?php

namespace CodexEditor\Entry\Block;

use HTMLPurifier;
use CodexEditor\Entry\Block\Interfaces\HTMLPurifyable;

abstract class Base {

    /**
     * @var $data {Array} - Block data
     */
    protected $data;

    /**
     * @var $sanitizer {Object} - Purrifier
     */
    protected $sanitizer;

    /**
     * @var $template {HTML} - HTML content
     */
    protected $template;

    /**
     * Base constructor.
     * @param $data
     */
    public function __construct($data)
    {

        $this->data = $data;

        if ($this instanceof HTMLPurifyable) {

            $this->sanitizer = \HTMLPurifier_Config::createDefault();

            $this->sanitizer->set('HTML.TargetBlank', true);
            $this->sanitizer->set('URI.AllowedSchemes', ['http' => true, 'https' => true]);
            $this->sanitizer->set('AutoFormat.RemoveEmpty', true);
        }

    }

    /** Initialize Block */
    abstract function initialize();

    /** Should be extended by Block Class */
    abstract function validate();

    /** Should be extended by Block Class */
    abstract function sanitize();

    public function getData()
    {
        return $this->data;
    }

    public static function getAllowedBlockTypes()
    {
        return include ('Config/blockTypes.php');
    }


}