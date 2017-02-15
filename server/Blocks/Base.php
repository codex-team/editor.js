<?php

namespace CodexEditor\Entry\Block;

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
    public function __construct($data) {

        $this->data = $data;

    }

    /** Initialize Block */
    abstract function initialize();

    /** Should be extended by Block Class */
    abstract function validate();

    /** Should be extended by Block Class */
    abstract function sanitize();

    public function getData() {
        return $this->data;
    }

}