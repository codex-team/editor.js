<?php

namespace CodexEditor\Entry\Block;

use \CodexEditor\Entry\Block\Interfaces\HTMLPurifyable;
use \HTMLPurifier;

class Paragraph extends Base implements HTMLPurifyable {

    protected $template = 'text';

    public function initialize()
    {
        $this->sanitize();
        return $this->validate();
    }

    /**
     * Clear dirty data
     *
     * @return void
     */
    public function sanitize()
    {
        $allowedTags = 'a[href],br,p,strong,b,i,em';

        if ($this->data['type'] === 'text_limited') {
            $allowedTags = 'a[href],br,p';
        }

        $sanitizer = clone $this->sanitizer;
        $sanitizer->set('HTML.Allowed', $allowedTags);

        $purifier = new HTMLPurifier($sanitizer);

        $this->data['data']['text'] = $purifier->purify($this->data['data']['text']);

    }

    /**
     * Validate input data
     *
     * @return boolean
     */
    public function validate()
    {
        if (is_array($this->data) && in_array($this->data['type'], self::getAllowedBlockTypes()['Paragraph']) && is_array($this->data['data']) && isset($this->data['data']['format']) && $this->data['data']['format'] === 'html' && isset($this->data['data']['text']) && !empty($this->data['data']['text'])) {
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