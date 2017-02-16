<?php

namespace CodexEditor\Entry;

use CodexEditor\Entry\Block\Base;

class Factory {

    /**
     * Get block class
     * @param array $data
     *
     * @return object
     */
    public static function getBlock(array $data)
    {
        if (isset($data['type']) && !empty($data['type'])) {
            $type = ucfirst(trim(strtolower($data['type'])));

            /**
             * allowed datatypes from redactor
             */
            $allowedBlockNameTypes = Base::getAllowedBlockTypes();

            /**
             * Returns correct type name
             *
             * @var $blockName    - correct type name
             * @var $allowedTypes - list of allowed type names
             */
            foreach ($allowedBlockNameTypes as $blockName => $allowedTypes) {
                if (in_array($data['type'], $allowedTypes)) {
                    $type = $blockName;
                    break;
                }
            }

            /**
             * Getting block
             * @var $blockClass - Block Class
             */
            $blockClass = "CodexEditor\\Entry\\Block\\" . $type;

            if (class_exists($blockClass)) {
                
                /** Call Base Class constructor */
                $block = new $blockClass($data);

                /** Call implemented initialize method */
                $block->initialize();

                return $block;
            }
        }

        return null;
    }
}