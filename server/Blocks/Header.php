<?php

namespace CodexEditor\Entry\Block;

use \CodexEditor\Entry\Block\Interfaces\HTMLPurifyable;
use \HTMLPurifier;

class Header extends Base implements HTMLPurifyable
{
    protected $template = 'header';

    public function initialize()
    {
        $this->sanitize();
        return $this->validate();
    }

    /**
     * @TODO clean data
     */
    public function sanitize()
    {
    }

    public function validate()
    {
        if (is_array($this->data) && in_array($this->data['type'], self::getAllowedBlockTypes()['Header']) && is_array($this->data['data']) && isset($this->data['data']['format']) && $this->data['data']['format'] === 'html' && isset($this->data['data']['text']) && !empty($this->data['data']['text'])) {
            return true;
        }

        return null;
    }

    public function getTemplate()
    {
        return $this->template;
    }
}