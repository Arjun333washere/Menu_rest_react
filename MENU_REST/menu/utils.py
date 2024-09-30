import qrcode
from io import BytesIO
from django.core.files import File

def generate_qr_code(menu):
    # Base URL for the React frontend
    frontend_base_url = "http://localhost:3000"
    
    # Construct the URL for viewing the menu on the frontend (public endpoint)
    menu_url = f"{frontend_base_url}/menu/menus/{menu.id}/public/"
    
    # Generate the QR code with the updated frontend URL
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(menu_url)  # Add the public menu URL to the QR code
    qr.make(fit=True)

    # Create an image from the QR code
    img = qr.make_image(fill='black', back_color='white')

    # Save the image to a BytesIO object
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)  # Reset the file pointer to the beginning

    # Save the image to the menu's qr_code field
    filename = f"qr_code_{menu.id}.png"
    menu.qr_code.save(filename, File(img_io), save=True)
