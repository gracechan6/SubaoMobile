/*
 * Copyright 2013, Edmodo, Inc. 
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file, or at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" 
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language 
 * governing permissions and limitations under the License. 
 */

package cropper.cropwindow.handle;

import android.graphics.Rect;

import cropper.cropwindow.edge.Edge;


/**
 * Enum representing a pressable, draggable Handle on the crop window.
 */
public enum Handle {

    TOP_LEFT(new cropper.cropwindow.handle.CornerHandleHelper(Edge.TOP, Edge.LEFT)),
    TOP_RIGHT(new cropper.cropwindow.handle.CornerHandleHelper(Edge.TOP, Edge.RIGHT)),
    BOTTOM_LEFT(new cropper.cropwindow.handle.CornerHandleHelper(Edge.BOTTOM, Edge.LEFT)),
    BOTTOM_RIGHT(new cropper.cropwindow.handle.CornerHandleHelper(Edge.BOTTOM, Edge.RIGHT)),
    LEFT(new cropper.cropwindow.handle.VerticalHandleHelper(Edge.LEFT)),
    TOP(new cropper.cropwindow.handle.HorizontalHandleHelper(Edge.TOP)),
    RIGHT(new cropper.cropwindow.handle.VerticalHandleHelper(Edge.RIGHT)),
    BOTTOM(new cropper.cropwindow.handle.HorizontalHandleHelper(Edge.BOTTOM)),
    CENTER(new cropper.cropwindow.handle.CenterHandleHelper());

    // Member Variables ////////////////////////////////////////////////////////

    private cropper.cropwindow.handle.HandleHelper mHelper;

    // Constructors ////////////////////////////////////////////////////////////

    Handle(cropper.cropwindow.handle.HandleHelper helper) {
        mHelper = helper;
    }

    // Public Methods //////////////////////////////////////////////////////////

    public void updateCropWindow(float x,
                                 float y,
                                 Rect imageRect,
                                 float snapRadius) {

        mHelper.updateCropWindow(x, y, imageRect, snapRadius);
    }

    public void updateCropWindow(float x,
                                 float y,
                                 float targetAspectRatio,
                                 Rect imageRect,
                                 float snapRadius) {

        mHelper.updateCropWindow(x, y, targetAspectRatio, imageRect, snapRadius);
    }
}
