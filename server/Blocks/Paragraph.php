<?php

namespace CodexEditor\Entry\Block;

class Paragraph extends Base {

    protected $template = 'text';

    public function initialize()
    {
        $this->sanitize();
        $this->validate();
    }

    /**
     * Clear dirty data
     *
     * @return void
     */
    public function sanitize()
    {
        // Sanitize input data
    }

    /**
     * Validate input data
     *
     * @return boolean
     */
    public function validate()
    {
        if (is_array($this->data) && in_array($this->data['type'], ['text', 'text_limited', 'paragraph']) && is_array($this->data['data']) && isset($this->data['data']['format']) && $this->data['data']['format'] === 'html' && isset($this->data['data']['text']) && !empty($this->data['data']['text'])) {
            return true;
        }

        return null;
    }

    /**
     * Must return HTML template
     * @return string
     */
    public function getTemplate() {
        return $this->template;
    }

}